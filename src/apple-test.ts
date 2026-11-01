import { bootFilm } from './app';
import { appleTestScene, APPLE_TEST_CUES } from './reels/appleTest';
import './style.css';

bootFilm({ scenes: [appleTestScene], cues: APPLE_TEST_CUES, title: 'Táo Lém', fileName: 'tao-lem-test.webm' });
