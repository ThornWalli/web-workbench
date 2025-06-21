import type { Model } from './types';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import {
  MenuItemInteraction,
  MenuItemSeparator,
  MenuItemUpload
} from '@web-workbench/core/classes/MenuItem';
import { KEYBOARD_CODE } from '@web-workbench/core/services/dom';

import { getDocumentFromUrl } from './lib/utils/document';
import { computed } from 'vue';
import { DEMO_IMAGES } from './utils';
import { ipoint } from '@js-basics/vector';

export default defineMenuItems<{ model: Model }>(({ model }) => {
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
          action(file: File[]) {
            return model.actions?.import(file[0]);
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
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          title: 'Resize…',
          action() {
            model.actions?.openResize();
          }
        }),
        new MenuItemInteraction({
          title: 'Resize Canvas…',
          action() {
            model.actions?.openResizeCanvas();
          }
        })
      ]
    }),

    new MenuItemInteraction({
      title: 'Colors',
      items: [
        new MenuItemInteraction({
          title: 'Palette',
          items: [
            new MenuItemInteraction({
              title: 'Export…'
            }),
            new MenuItemInteraction({
              title: 'Import…'
            }),
            new MenuItemSeparator(),
            new MenuItemInteraction({
              title: 'Reset'
            })
          ]
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
    new MenuItemInteraction({
      title: 'Debug',
      items: [
        new MenuItemInteraction({
          title: 'Document',
          items: [
            new MenuItemInteraction({
              title: 'Lenna',
              async action() {
                return model.app.setDocument(
                  await getDocumentFromUrl(DEMO_IMAGES.LENNA)
                );
              }
            }),
            new MenuItemInteraction({
              title: 'Disk',
              async action() {
                return model.app.setDocument(
                  await getDocumentFromUrl(DEMO_IMAGES.DISK)
                );
              }
            }),
            new MenuItemInteraction({
              title: 'Web Painting',
              async action() {
                return model.app.setDocument(
                  await getDocumentFromUrl(DEMO_IMAGES.WEB_PAINTING)
                );
              }
            }),
            new MenuItemInteraction({
              title: 'Cuby',
              async action() {
                return model.app.setDocument(
                  await getDocumentFromUrl(DEMO_IMAGES.CUBY)
                );
              }
            })
          ]
        }),
        new MenuItemInteraction({
          title: 'Display',
          items: [
            new MenuItemInteraction({
              title: 'Add',
              options: {
                disabled: computed(() => model.app.hasMaxDisplays)
              },
              action() {
                return model.app.addDisplay();
              }
            }),
            new MenuItemInteraction({
              title: 'Remove',
              options: {
                disabled: computed(() => !model.app.displays.length)
              },
              action() {
                return model.app.removeDisplay(
                  model.app.displays[model.app.displays.length - 1]
                );
              }
            })
          ]
        }),
        new MenuItemInteraction({
          title: 'Color Picker',
          action() {
            return model.actions?.openDebugColorPickers();
          }
        })
      ]
    })
  ].filter(Boolean);

  function actionClose() {
    return model.actions?.close();
  }
});
