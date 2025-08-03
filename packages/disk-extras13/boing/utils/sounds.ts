import sfx_ground_1 from '../assets/sounds/sfx/ground_1.mp3';
import sfx_ground_2 from '../assets/sounds/sfx/ground_2.mp3';
import sfx_wall_1 from '../assets/sounds/sfx/wall_1.mp3';

export enum SOUND_TYPE {
  MUSIC = 'music',
  SFX = 'sfx'
}

export enum MUSIC {}
export enum SFX {
  GROUND_1 = 'ground_1',
  GROUND_2 = 'ground_2',
  WALL_1 = 'wall_1'
}

export const music: { [key in MUSIC]: string } = {};

export const sfx: { [key in SFX]: string } = {
  [SFX.GROUND_1]: sfx_ground_1,
  [SFX.GROUND_2]: sfx_ground_2,
  [SFX.WALL_1]: sfx_wall_1
};
