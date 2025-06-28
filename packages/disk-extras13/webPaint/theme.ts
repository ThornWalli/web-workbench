import beige from '@web-workbench/core/themes/beige';
import type { WebPaintThemeColors } from './types/theme';

export function getDefaultThemeColors(
  colors = ['#FFF', '#000', '#FFAA55', '#0055AA']
): WebPaintThemeColors {
  return {
    originSelect: {
      background: colors[2],
      foreground: colors[0],
      selected: {
        background: colors[1],
        foreground: colors[0]
      }
    },

    colorSelect: {
      border: colors[3],
      selcted: {
        border: colors[0]
      },
      filled: {
        border: colors[0],
        selected: {
          border: colors[3]
        }
      }
    },

    iconButton: {
      background: colors[1],
      foreground: colors[0],
      hover: {
        background: colors[1],
        foreground: colors[0]
      },
      filled: {
        background: colors[3],
        foreground: colors[0],
        hover: {
          background: colors[2],
          foreground: colors[3]
        }
      }
    },

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
      webPaint: getDefaultThemeColors([
        '#F5F5DC',
        '#6B4226',
        '#D2B48C',
        '#000000'
      ])
    }
  }
});
export default theme;
