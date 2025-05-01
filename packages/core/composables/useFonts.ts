import { kebabCase } from 'change-case';
import { useHead } from '#imports';
import { ref } from 'vue';

const fontDefinitions = ref<FontDefinition[]>([]);

export interface FontDefinition {
  preload?: boolean;
  fontFamily: string;
  fontVariant: string;
  fontFeatureSettings: string;
  fontStretch?: string;
  fontWeight: string | number;
  fontStyle: string;
  fontDisplay: string;
  src: [string, string];
}

export default function useFonts() {
  const registerFont = (definitions: FontDefinition[]) => {
    definitions = definitions.filter(
      fontDefinition =>
        !fontDefinitions.value.find(
          definition => definition.fontFamily === fontDefinition.fontFamily
        )
    );
    fontDefinitions.value = [...fontDefinitions.value, ...definitions];
  };

  useHead(() => {
    return {
      link: fontDefinitions.value
        .filter(font => font.preload)
        .map(font => {
          return {
            key: `preload-${kebabCase(font.fontFamily)}`,
            rel: 'preload',
            as: 'font',
            href: font.src[0],
            type: `font/${font.src[1]}`,
            crossorigin: 'anonymous'
          };
        }),
      style: [
        {
          key: 'fonts',
          innerHTML: toFontFaces(fontDefinitions.value)
        }
      ]
    };
  });
  return {
    registerFont
  };
}

function toFontFaces(fonts: FontDefinition[]) {
  return fonts
    .map(font => {
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
    })
    .join('\n');
}
