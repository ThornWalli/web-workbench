import { kebabCase } from 'change-case';
import { useHead } from '#imports';
import { ref } from 'vue';

const fontDefinitions = ref([]);

export default function useFonts() {
  const registerFont = definitions => {
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

function toFontFaces(fonts) {
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
