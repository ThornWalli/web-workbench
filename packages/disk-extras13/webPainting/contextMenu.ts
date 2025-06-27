import type { Model } from './types';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import {
  MenuItemInteraction,
  MenuItemSeparator,
  MenuItemUpload
} from '@web-workbench/core/classes/MenuItem';
import { KEYBOARD_CODE } from '@web-workbench/core/types/dom';

import { computed } from 'vue';
import { ipoint } from '@js-basics/vector';
import tools from './contextMenu/tools';
import image from './contextMenu/image';
import debug from './contextMenu/debug';

export default defineMenuItems<{ model: Model }>(options => {
  const { model } = options;

  return [
    new MenuItemInteraction({
      title: 'WebPainting',
      items: [
        new MenuItemInteraction({
          hotKey: { alt: true, code: KEYBOARD_CODE.KEY_I, title: 'I' },
          title: 'Settings',
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
          title: 'New',
          hotKey: { alt: true, code: KEYBOARD_CODE.KEY_N, title: 'N' },
          action() {
            return model.actions?.newDocument();
          }
        }),
        new MenuItemInteraction({
          title: 'Open…',
          hotKey: { alt: true, code: KEYBOARD_CODE.KEY_O, title: 'O' },
          action() {
            return model.actions?.openDocument();
          }
        }),
        new MenuItemInteraction({
          title: 'Save',
          hotKey: { alt: true, code: KEYBOARD_CODE.KEY_S, title: 'S' },
          action() {
            return model.actions?.saveDocument();
          }
        }),
        new MenuItemInteraction({
          title: 'Save As…',
          action() {
            return model.actions?.saveAsDocument();
          }
        }),
        new MenuItemSeparator(),
        new MenuItemUpload({
          title: 'Import…',
          accept: ['image/png', 'image/jpeg', 'image/webp'],
          action({ files }) {
            return model.actions?.import(files![0]);
          }
        }),
        new MenuItemInteraction({
          title: 'Export…',
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
          hotKey: { alt: true, code: KEYBOARD_CODE.KEY_Z, title: 'Z' },
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
          hotKey: { alt: true, code: KEYBOARD_CODE.KEY_Y, title: 'Y' },
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
        })
      ]
    }),

    ...image(options),
    ...tools(options),

    new MenuItemInteraction({
      title: 'Color Palette',
      items: [
        new MenuItemInteraction({
          title: 'Presets',
          options: {
            disabled: true
          }
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          title: 'Export…',
          options: {
            disabled: true
          }
        }),
        new MenuItemInteraction({
          title: 'Import…',
          options: {
            disabled: true
          }
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          title: 'Reset',
          options: {
            disabled: true
          }
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

    ...debug(options)
  ].filter(Boolean);

  function actionClose() {
    return model.actions?.close();
  }
});
