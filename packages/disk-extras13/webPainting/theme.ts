import beige from '@web-workbench/core/themes/beige';
import type { WebPaintingThemeColors } from './types/theme';

export function getDefaultThemeColors(
  colors = ['#FFF', '#000', '#FFAA55', '#0055AA']
): WebPaintingThemeColors {
  return {
    sidebar: {
      background: {
        primary: colors[2],
        secondary: colors[0]
      },
      border: colors[2],

      brushSelect: {
        background: colors[0],
        item: {
          foreground: colors[2],
          selected: {
            foreground: colors[3]
          }
        }
      },

      toolSelect: {
        background: colors[2],
        item: {
          background: colors[0],
          foreground: colors[3],
          selected: {
            background: colors[2],
            foreground: colors[3]
          }
        }
      },

      colorSelect: {
        background: '#000',
        item: {
          selected: {
            border: '#fff'
          }
        }
      }
    }
  };
}

const theme = beige.extend('Web Painting', {
  colors: {
    disks: {
      webPainting: getDefaultThemeColors([
        '#F5F5DC',
        '#6B4226',
        '#D2B48C',
        '#000000'
      ])
    }
  }
});
export default theme;
