import { paramCase } from 'change-case';
import AmigaTopaz13 from '../assets/fonts/Amiga-Topaz-13/Amiga-Topaz-13.woff2';
import AmigaTopaz13Console from '../assets/fonts/Amiga-Topaz-13-Console/Amiga-Topaz-13-Console.woff2';
import { useHead } from '#imports';

export default function useFonts () {
  useHead({
    link: fonts.filter(font => font.preload).map((font) => {
      return ({
        key: `preload-${paramCase(font.fontFamily)}`,
        rel: 'preload',
        as: 'font',
        href: font.src[0],
        type: `font/${font.src[1]}`,
        crossorigin: 'anonymous'
      });
    }),
    style: [
      {
        key: 'fonts',
        innerHTML: toFontFaces(fonts)
      }
    ]
  });
}

const fonts = [

  {
    preload: true,
    fontFamily: 'Amiga Topaz 13',
    fontVariant: 'normal',
    fontFeatureSettings: 'normal',
    fontStretch: 'normal',
    fontWeight: 400,
    fontStyle: 'normal',
    fontDisplay: 'swap',
    src: [
      AmigaTopaz13, 'woff2'
    ]
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
    src: [
      AmigaTopaz13Console, 'woff2'
    ]
  },

  {
    fontFamily: 'Amiga Topaz 13',
    fontVariant: 'normal',
    fontFeatureSettings: 'normal',
    fontStretch: 'normal',
    fontWeight: 700,
    fontStyle: 'normal',
    fontDisplay: 'swap',
    src: [
      AmigaTopaz13, 'woff2'
    ]
  },

  {
    fontFamily: 'Amiga Topaz 13 Console',
    fontVariant: 'normal',
    fontFeatureSettings: 'normal',
    fontStretch: 'normal',
    fontWeight: 700,
    fontStyle: 'normal',
    fontDisplay: 'swap',
    src: [
      AmigaTopaz13Console, 'woff2'
    ]
  }

];

function toFontFaces (fonts) {
  return fonts.map((font) => {
    return `
@font-face {
  font-family: "${font.fontFamily}";
  font-variant: ${font.fontVariant};
  font-feature-settings: ${font.fontFeatureSettings};
  font-stretch: ${font.fontStretch};
  font-weight: ${font.fontWeight};
  font-style: ${font.fontStyle};
  font-display: ${font.fontDisplay};
  src: url(${font.src[0]}) format("${font.src[1]}");
}
`;
  }).join('\n');
}
