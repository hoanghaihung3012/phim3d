import { CUES_2D } from './film2d/cues';
import { bootFilm2D } from './film2d/boot';
import { SCENES_2D } from './film2d/scenes';
import './style.css';

// The film is now 2D hand-drawn. The earlier 3D version still runs from film3d.html.
bootFilm2D({ scenes: SCENES_2D, cues: CUES_2D });
