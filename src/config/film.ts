/** Global film settings (from docs/script.md, section 3). */
export const FILM = {
  title: 'Táo Muốn Bay',
  width: 1920,
  height: 1080,
  fps: 30,
} as const;

/** Pastel palette shared by characters, props and sky. */
export const PALETTE = {
  mochi: '#FFC7D1',
  mochiCheek: '#FF8FA3',
  eye: '#2B2233',
  cloud: '#FFFFFF',
  cloudShade: '#DDEBFF',
  sparrow: '#FFE58A',
  beak: '#FFA94D',
  hill: '#BDEBC4',
  bush: '#9ADBA8',
  skyTop: '#BFE3FF',
  skyBottom: '#FFE3EC',
  flowerPetals: ['#FFB3C6', '#FFF1A8', '#CDB4FF'],
} as const;
