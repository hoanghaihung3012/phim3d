import { bootFilm } from './app';
import { CUES } from './audio/cues';
import { SCENES } from './scenes';
import './style.css';

bootFilm({ scenes: SCENES, cues: CUES });
