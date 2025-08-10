import Palette from '../lib/classes/Palette';
import palette_aap64 from './colorPalette/palettes/aap64';
import palette_apple2 from './colorPalette/palettes/apple2';
import palette_arne16 from './colorPalette/palettes/arne16';
import palette_bobRoss from './colorPalette/palettes/bobRoss';
import palette_bubblegum16 from './colorPalette/palettes/bubblegum16';
import palette_c64 from './colorPalette/palettes/c64';
import palette_cga_0 from './colorPalette/palettes/cga0';
import palette_cga_1 from './colorPalette/palettes/cga1';
import palette_cga_2 from './colorPalette/palettes/cga2';
import palette_db16 from './colorPalette/palettes/db16';
import palette_edg20 from './colorPalette/palettes/edg20';
import palette_gameBoy from './colorPalette/palettes/gameBoy';
import palette_lospec500 from './colorPalette/palettes/lospec500';
import palette_nes from './colorPalette/palettes/nes';
import palette_pico8 from './colorPalette/palettes/pico8';
import palette_win_256 from './colorPalette/palettes/win256';
import palette_zx_spectrum from './colorPalette/palettes/zxSpectrum';
import Color from '@web-workbench/core/classes/Color';
import PaletteColor from '../lib/classes/PaletteColor';

export enum PALETTE {
  AAP_64 = 'aap_64',
  APPLE_2 = 'apple_2',
  ARNE_16 = 'arne_16',
  BOB_ROSS = 'bob_ross',
  BUBBLEGUM_16 = 'bubblegum_16',
  C64 = 'c64',
  CGA_0 = 'cga_0',
  CGA_1 = 'cga_1',
  CGA_2 = 'cga_2',
  DB_16 = 'db_16',
  EDG_20 = 'edg_20',
  GAME_BOY = 'game_boy',
  LOSPEC_500 = 'lospec_500',
  NES = 'nes',
  PICO_8 = 'pico_8',
  WIN_256 = 'win_256',
  ZX_SPECTRUM = 'zx_spectrum'
}
const palettes = {
  [PALETTE.AAP_64]: palette_aap64,
  [PALETTE.APPLE_2]: palette_apple2,
  [PALETTE.ARNE_16]: palette_arne16,
  [PALETTE.BOB_ROSS]: palette_bobRoss,
  [PALETTE.BUBBLEGUM_16]: palette_bubblegum16,
  [PALETTE.C64]: palette_c64,
  [PALETTE.CGA_0]: palette_cga_0,
  [PALETTE.CGA_1]: palette_cga_1,
  [PALETTE.CGA_2]: palette_cga_2,
  [PALETTE.DB_16]: palette_db16,
  [PALETTE.EDG_20]: palette_edg20,
  [PALETTE.GAME_BOY]: palette_gameBoy,
  [PALETTE.LOSPEC_500]: palette_lospec500,
  [PALETTE.NES]: palette_nes,
  [PALETTE.PICO_8]: palette_pico8,
  [PALETTE.WIN_256]: palette_win_256,
  [PALETTE.ZX_SPECTRUM]: palette_zx_spectrum
};

export function getPalettes() {
  return Object.values(palettes);
}

export function getPalette(name: string) {
  if (!name || typeof name !== 'string') {
    throw new Error('Invalid palette name');
  }
  return palettes[name as PALETTE];
}

export function getDefaultPalette() {
  const { colors } = getPalette(PALETTE.AAP_64);
  return new Palette({
    id: 'default',
    name: 'Default Palette',
    colors: [
      new PaletteColor({
        id: 'black',
        color: new Color(0, 0, 0, 255)
      }),
      new PaletteColor({
        id: 'white',
        color: new Color(255, 255, 255, 255)
      }),
      ...colors
    ]
  });
}
