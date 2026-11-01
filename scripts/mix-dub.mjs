// Mixes recorded dialogue (a dub) onto an exported MP4.
//   node scripts/mix-dub.mjs <in.mp4> <dub.json> <out.mp4>
// dub.json: { "voiceGainDb": 4, "lines": [{ "t": 5.0, "file": "assets/voice/x/01.mp3", "skip": 1.2?, "gainDb": 0? }] }
//   t:    start time in the film (seconds)
//   skip: optional seconds to drop after the leading silence (e.g. a take where the TTS
//         read the style tag aloud before the line), then silence is trimmed again
// The film's own track (music, sfx; export it with --query nobabble) is ducked a little
// under each line, then the whole mix is loudness-normalised (EBU R128, -18 LUFS).
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const [input, dubPath, out] = process.argv.slice(2);
if (!out) throw new Error('Usage: node scripts/mix-dub.mjs <in.mp4> <dub.json> <out.mp4>');
const dub = JSON.parse(readFileSync(dubPath, 'utf8'));
const baseGain = dub.voiceGainDb ?? 0;

const args = ['-y', '-loglevel', 'error', '-i', input];
const chains = [];
dub.lines.forEach((line, i) => {
  args.push('-i', line.file);
  const skip = line.skip ? `,atrim=start=${line.skip},asetpts=PTS-STARTPTS,silenceremove=start_periods=1:start_threshold=-45dB` : '';
  const ms = Math.round(line.t * 1000);
  chains.push(
    `[${i + 1}:a]aresample=48000,aformat=channel_layouts=stereo,` +
      `silenceremove=start_periods=1:start_threshold=-45dB${skip},` +
      `volume=${baseGain + (line.gainDb ?? 0)}dB,adelay=${ms}|${ms}[v${i}]`,
  );
});
const n = dub.lines.length;
const voices = dub.lines.map((_, i) => `[v${i}]`).join('');
const filter = [
  ...chains,
  `${voices}amix=inputs=${n}:normalize=0:dropout_transition=0,asplit[vox][key]`,
  `[0:a]aresample=48000[bed]`,
  `[bed][key]sidechaincompress=threshold=0.05:ratio=4:attack=20:release=300[ducked]`,
  `[ducked][vox]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-18:TP=-1.5:LRA=11,aresample=48000[a]`,
].join(';');
args.push('-filter_complex', filter, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out);
const r = spawnSync('ffmpeg', args, { stdio: 'inherit' });
if (r.status !== 0) process.exit(r.status ?? 1);
console.log(`Done: ${out}`);
