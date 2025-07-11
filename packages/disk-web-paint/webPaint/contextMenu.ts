import { CONFIG_NAMES } from './types';
import type { Model } from './types';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import {
  MenuItemInteraction,
  MenuItemSeparator,
  MenuItemUpload
} from '@web-workbench/core/classes/MenuItem';
import { KEYBOARD_CODE, KEYBOARD_KEY } from '@web-workbench/core/types/dom';

import { computed } from 'vue';
import { ipoint } from '@js-basics/vector';
import tools from './contextMenu/tools';
import image from './contextMenu/image';
import debug from './contextMenu/debug';
import type Core from '@web-workbench/core/classes/Core';
import type { IPalette } from './lib/classes/Palette';
import Palette from './lib/classes/Palette';
import { getPalettes } from './utils/colorPalette';
import example from './contextMenu/example';

export default defineMenuItems<{ core: Core; model: Model }>(options => {
  const { model, core } = options;

  const customPalettes =
    core!.config.get<IPalette[]>(CONFIG_NAMES.WEB_PAINT_PALETTES) || [];
  const hasDebug =
    core!.config.get<IPalette[]>(CONFIG_NAMES.WEB_PAINT_DEBUG) || false;

  function getCustomPalettes(palettes: IPalette[]) {
    const items = palettes.map(palette => {
      return new MenuItemInteraction({
        title: palette.name,
        action() {
          return model.app.setColorPalette(new Palette(palette));
        }
      });
    });
    items.unshift(
      new MenuItemInteraction({
        title: 'No custom palettes',
        options: { disabled: true }
      })
    );
    return items;
  }

  return [
    new MenuItemInteraction({
      title: 'Web Paint',
      items: [
        new MenuItemInteraction({
          title: 'Settings…',
          action() {
            return model.actions?.openSettings();
          }
        }),
        new MenuItemInteraction({
          hotKey: { alt: true, code: KEYBOARD_CODE.KEY_I, title: 'I' },
          title: 'Info',
          action() {
            return model.actions?.openInfo();
          }
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          title: 'Close',
          action: actionClose
        })
      ]
    }),
    new MenuItemInteraction({
      title: 'File',
      items: [
        new MenuItemInteraction({
          title: 'New…',
          hotKey: { ctrl: true, code: KEYBOARD_CODE.KEY_N, title: 'N' },
          action() {
            return model.actions?.openNew();
          }
        }),
        new MenuItemInteraction({
          title: 'Open…',
          hotKey: { ctrl: true, code: KEYBOARD_CODE.KEY_O, title: 'O' },
          action() {
            return model.actions?.openDocument();
          }
        }),
        new MenuItemInteraction({
          title: 'Save…',
          hotKey: { ctrl: true, code: KEYBOARD_CODE.KEY_S, title: 'S' },
          action() {
            return model.actions?.saveDocument();
          }
        }),
        new MenuItemInteraction({
          title: 'Save As…',
          hotKey: {
            alt: true,
            ctrl: true,
            code: KEYBOARD_CODE.KEY_S,
            title: 'S'
          },
          action() {
            return model.actions?.saveAsDocument();
          }
        }),
        new MenuItemSeparator(),
        new MenuItemUpload({
          title: 'Import…',
          accept: ['image/png', 'image/jpeg', 'image/webp'],
          hotKey: {
            ctrl: true,
            code: KEYBOARD_CODE.KEY_I,
            title: 'I'
          },
          action({ files }) {
            return model.actions?.import(files![0]);
          }
        }),
        new MenuItemInteraction({
          title: 'Export…',
          hotKey: {
            ctrl: true,
            code: KEYBOARD_CODE.KEY_E,
            title: 'E'
          },
          action() {
            return model.actions?.openExport();
          }
        })
      ]
    }),

    new MenuItemInteraction({
      title: 'Edit',
      items: [
        new MenuItemInteraction({
          title: 'Undo',
          hotKey: {
            cmd: true,
            ctrl: true,
            key: KEYBOARD_KEY.KEY_Z,
            title: 'Z'
          },
          options: {
            disabled: computed(() => {
              return !(
                model.app.state.stackIndex > -1 &&
                model.app.state.stackCount > 0
              );
            })
          },
          action() {
            model.app.actions.stackUndo();
          }
        }),
        new MenuItemInteraction({
          title: 'Redo',
          hotKey: {
            cmd: true,
            ctrl: true,
            key: KEYBOARD_KEY.KEY_Y,
            title: 'Y'
          },
          options: {
            disabled: computed(() => {
              return !(
                model.app.state.stackCount > 0 &&
                model.app.state.stackIndex < model.app.state.stackCount - 1
              );
            })
          },
          action() {
            model.app.actions.stackRedo();
          }
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          title: 'Embed Image',
          items: [
            new MenuItemInteraction({
              title: 'Paste',
              hotKey: {
                cmd: true,
                ctrl: true,
                key: KEYBOARD_KEY.KEY_V,
                title: 'V'
              },
              options: {
                disabled: true
              },
              action() {
                // return model.actions?.pasteImage();
              }
            }),
            new MenuItemInteraction({
              title: 'Open…',
              options: {
                disabled: true
              }
            }),
            new MenuItemInteraction({
              title: 'Import…',
              options: {
                disabled: true
              }
            })
          ]
        })
      ]
    }),

    ...image(options),
    ...tools(options),

    new MenuItemInteraction({
      title: 'Color Palette',
      items: [
        new MenuItemInteraction({
          title: 'Settings…',
          action() {
            return model.actions?.openColorPalette();
          }
        }),
        new MenuItemSeparator(),
        ...getCustomPalettes(customPalettes),
        new MenuItemSeparator(),
        ...getPalettes().map(palette => {
          return new MenuItemInteraction({
            title: palette.name,
            action() {
              return model.app.setColorPalette(new Palette(palette));
            }
          });
        })
      ]
    }),

    new MenuItemInteraction({
      title: 'Display',
      items: [
        new MenuItemInteraction({
          title: 'Split',
          items: [
            new MenuItemInteraction({
              title: '1 Display',
              action() {
                return model.app.setDisplays(1);
              }
            }),
            new MenuItemInteraction({
              title: '2 Display',
              action() {
                return model.app.setDisplays(2);
              }
            }),
            new MenuItemInteraction({
              title: '3 Display',
              action() {
                return model.app.setDisplays(3);
              }
            }),
            new MenuItemInteraction({
              title: '4 Display',
              action() {
                return model.app.setDisplays(4);
              }
            })
          ]
        }),
        new MenuItemInteraction({
          title: 'Reset',
          items: [
            new MenuItemInteraction({
              title: 'All',
              action() {
                return Promise.all([
                  model.app.currentDisplay?.actions.setPosition(ipoint(0, 0)),
                  model.app.currentDisplay?.actions.setZoom(ipoint(0, 0), 0)
                ]);
              }
            }),
            new MenuItemSeparator(),
            new MenuItemInteraction({
              title: 'Position',
              action() {
                return model.app.currentDisplay?.actions.setPosition(
                  ipoint(0, 0)
                );
              }
            }),
            new MenuItemInteraction({
              title: 'Zoom',
              action() {
                return model.app.currentDisplay?.actions.setZoom(
                  ipoint(0, 0),
                  0
                );
              }
            })
          ]
        })
      ]
    }),

    ...example(options),

    ...(hasDebug ? debug(options) : [])
  ].filter(Boolean);

  function actionClose() {
    return model.actions?.close();
  }
});
