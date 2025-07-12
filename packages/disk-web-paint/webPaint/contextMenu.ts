import { CONFIG_NAMES, PROPERTY } from './types';
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
import Palette from './lib/classes/Palette';
import { getPalettes } from './utils/colorPalette';
import example from './contextMenu/example';
import { blobFromDataURI, blobFromFile } from '@web-workbench/core/utils/blob';
import type { Model } from './types';
import type Core from '@web-workbench/core/classes/Core';
import type { IPalette } from './lib/classes/Palette';

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
        ...example(options),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          hotKey: { ctrl: true, code: KEYBOARD_CODE.KEY_Q, title: 'Q' },
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
          title: 'Clipboard Import',
          hotKey: {
            ctrl: true,
            alt: true,
            code: KEYBOARD_CODE.KEY_I,
            title: 'I'
          },
          async action() {
            return model.actions?.importClipboard();
          }
        }),
        new MenuItemSeparator(),
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
            meta: true,
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
            meta: true,
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
          title: 'Copy',
          hotKey: {
            meta: true,
            key: KEYBOARD_KEY.KEY_C,
            title: 'C'
          },
          action() {
            return model.actions.clipboardCopy();
          }
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          title: 'Insert Image',
          items: [
            new MenuItemInteraction({
              title: 'Paste',
              hotKey: {
                meta: true,
                key: KEYBOARD_KEY.KEY_V,
                title: 'V'
              },
              options: {
                // disabled: true
              },
              async action() {
                const validMimeTypes = [
                  'image/png',
                  'image/jpeg',
                  'image/webp',
                  'image/gif'
                ];
                const items = await navigator.clipboard.read();
                items.forEach(async item => {
                  const type = item.types.find(type =>
                    validMimeTypes.includes(type)
                  );
                  if (type) {
                    const blob = await item.getType(type);
                    model.actions.openEmbedImage(blob);
                  }
                });
              }
            }),
            new MenuItemInteraction({
              title: 'Open…',
              async action() {
                const data = await core.executeCommand('openFileDialog');
                if (data) {
                  if (PROPERTY.CONTENT in data.value) {
                    model.actions.openEmbedImage(
                      blobFromDataURI(data.value[PROPERTY.CONTENT])
                    );
                  } else {
                    throw new Error("Can't read file content");
                  }
                }
              }
            }),
            new MenuItemUpload({
              title: 'Import…',
              accept: ['image/png', 'image/jpeg', 'image/webp'],
              multiple: true,
              action({ files }) {
                files?.forEach(async file => {
                  if (file.type.startsWith('image/')) {
                    model.actions.openEmbedImage(await blobFromFile(file));
                  }
                });
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
          title: 'Grid…',
          action() {
            return model.actions?.openGridSettings();
          }
        }),
        new MenuItemSeparator(),
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

    ...(hasDebug ? debug(options) : [])
  ].filter(Boolean);

  function actionClose() {
    return model.actions?.close();
  }
});
