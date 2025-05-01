import AmigaTopazWB13 from '../assets/fonts/AmigaTopazWB13/AmigaTopazWB13.woff2';
import AmigaTopazWB13Monospace from '../assets/fonts/AmigaTopazWB13Monospace/AmigaTopazWB13Monospace.woff2';
import BitFont from '../assets/fonts/BitFont/BitFont.woff2';
import type { FontDefinition } from '../composables/useFonts';

export const fonts: FontDefinition[] = [
  {
    preload: true,
    fontFamily: 'Amiga Topaz 13',
    fontVariant: 'normal',
    fontFeatureSettings: 'normal',
    fontStretch: 'normal',
    fontWeight: 400,
    fontStyle: 'normal',
    fontDisplay: 'swap',
    src: [AmigaTopazWB13, 'woff2']
  },
  {
    preload: true,
    fontFamily: 'Amiga Topaz 13 Console',
    fontVariant: 'normal',
    fontFeatureSettings: 'normal',
    fontStretch: 'normal',
    fontWeight: 400,
    fontStyle: 'normal',
    fontDisplay: 'swap',
    src: [AmigaTopazWB13Monospace, 'woff2']
  },
  {
    fontFamily: 'Amiga Topaz 13',
    fontVariant: 'normal',
    fontFeatureSettings: 'normal',
    fontStretch: 'normal',
    fontWeight: 700,
    fontStyle: 'normal',
    fontDisplay: 'swap',
    src: [AmigaTopazWB13, 'woff2']
  },
  {
    fontFamily: 'Amiga Topaz 13 Console',
    fontVariant: 'normal',
    fontFeatureSettings: 'normal',
    fontStretch: 'normal',
    fontWeight: 700,
    fontStyle: 'normal',
    fontDisplay: 'swap',
    src: [AmigaTopazWB13Monospace, 'woff2']
  },
  {
    fontFamily: 'BitFont',
    fontVariant: 'normal',
    fontFeatureSettings: 'normal',
    fontWeight: 400,
    fontStyle: 'normal',
    fontDisplay: 'swap',
    src: [BitFont, 'woff2']
  }
];
