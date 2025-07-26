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
import useI18n from './composables/useI18n';
import { imageToBlob, loadImage } from '@web-workbench/core/utils/image';
import { CONFIG_NAMES as CONFIG_NAMES_CORE } from '@web-workbench/core/classes/Core/types';

export default defineMenuItems<{ core: Core; model: Model }>(options => {
  const { model, core } = options;

  const customPalettes =
    core!.config.get<IPalette[]>(CONFIG_NAMES.WEB_PAINT_PALETTES) || [];
  const hasDebug =
    core!.config.get<boolean>(CONFIG_NAMES.WEB_PAINT_DEBUG) || false;

  const { t } = useI18n();

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
        title: t('context_menu.color_palette.items.no_palettes.title'),
        options: { disabled: true }
      })
    );
    return items;
  }

  return [
    new MenuItemInteraction({
      title: t('context_menu.general.title'),
      items: [
        new MenuItemInteraction({
          title: t('context_menu.general.items.workingMode.title'),
          async action() {
            if (
              await core.executeCommand(
                `openDialog "${t('context_menu.general.items.workingMode.text')}" --confirm`
              )
            ) {
              core.config.set(CONFIG_NAMES_CORE.SCREEN_1084_FRAME, false);
              core.config.set(CONFIG_NAMES_CORE.SCREEN_REAL_LOOK, false);
              core.config.set(CONFIG_NAMES_CORE.SCREEN_SCAN_LINES, false);
              const url = new URL(window.location.href);
              url.searchParams.set('no-boot', 'true');
              url.searchParams.set('no-webdos', 'true');
              url.searchParams.set(
                'start-command',
                'execute "DF2:WebPaint.app"'
              );
              window.location.href = url.toString();
            }
          }
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          title: 'Settings…',
          action() {
            return model.actions?.openSettings();
          }
        }),
        new MenuItemInteraction({
          hotKey: { alt: true, code: KEYBOARD_CODE.KEY_I, title: 'I' },
          title: t('context_menu.general.items.help.title'),
          action() {
            return model.actions?.openHelp();
          }
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          hotKey: { alt: true, code: KEYBOARD_CODE.KEY_I, title: 'I' },
          title: t('context_menu.general.items.info.title'),
          action() {
            return model.actions?.openInfo();
          }
        }),
        new MenuItemSeparator(),
        ...example(options),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          hotKey: { ctrl: true, code: KEYBOARD_CODE.KEY_Q, title: 'Q' },
          title: t('context_menu.general.items.close.title'),
          action: actionClose
        })
      ]
    }),
    new MenuItemInteraction({
      title: 'File',
      items: [
        new MenuItemInteraction({
          title: t('context_menu.file.items.new.title'),
          hotKey: { ctrl: true, code: KEYBOARD_CODE.KEY_N, title: 'N' },
          action() {
            return model.actions?.openNewDocument();
          }
        }),
        new MenuItemInteraction({
          title: t('context_menu.file.items.open.title'),
          hotKey: { ctrl: true, code: KEYBOARD_CODE.KEY_O, title: 'O' },
          action() {
            return model.actions?.openDocument();
          }
        }),
        new MenuItemInteraction({
          title: t('context_menu.file.items.save.title'),
          hotKey: { ctrl: true, code: KEYBOARD_CODE.KEY_S, title: 'S' },
          action() {
            return model.actions?.saveDocument();
          }
        }),
        new MenuItemInteraction({
          title: t('context_menu.file.items.save_as.title'),
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
        new MenuItemInteraction({
          title: t('context_menu.file.items.export.title'),
          hotKey: {
            ctrl: true,
            code: KEYBOARD_CODE.KEY_E,
            title: 'E'
          },
          action() {
            return model.actions?.openExport();
          }
        }),
        new MenuItemSeparator(),
        new MenuItemUpload({
          title: t('context_menu.file.items.import_document.title'),
          accept: ['.wpd', 'application/zip'],
          // accept: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
          action({ files }) {
            return model.actions?.importDocument(files![0]);
          }
        }),
        new MenuItemInteraction({
          title: t('context_menu.file.items.export_document.title'),
          action() {
            return model.actions?.exportDocument();
          }
        }),

        new MenuItemSeparator(),
        new MenuItemUpload({
          title: t('context_menu.file.items.import.title'),
          accept: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
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
          title: t('context_menu.file.items.import_clipboard.title'),
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
          title: t('context_menu.file.items.document_settings.title'),
          action() {
            return model.actions?.openDocumentSettings();
          }
        })
      ]
    }),

    new MenuItemInteraction({
      title: t('context_menu.edit.title'),
      items: [
        new MenuItemInteraction({
          title: t('context_menu.edit.items.undo.title'),
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
          title: t('context_menu.edit.items.redo.title'),
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
          title: t('context_menu.edit.items.copy.title'),
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
          title: t('context_menu.edit.items.insert_image.title'),
          items: [
            new MenuItemInteraction({
              title: t(
                'context_menu.edit.items.insert_image.items.paste.title'
              ),
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
                  'image/webp'
                ];
                const items = await navigator.clipboard.read();
                items.forEach(async item => {
                  const type = item.types.find(type =>
                    validMimeTypes.includes(type)
                  );
                  if (type) {
                    model.actions.openInsertImage(await item.getType(type));
                  }
                });
              }
            }),
            new MenuItemInteraction({
              title: t('context_menu.edit.items.insert_image.items.open.title'),
              async action() {
                const data = await core.executeCommand('openFileDialog');
                if (data) {
                  if (PROPERTY.CONTENT in data.value) {
                    model.actions.openInsertImage(
                      blobFromDataURI(data.value[PROPERTY.CONTENT])
                    );
                  } else {
                    throw new Error("Can't read file content");
                  }
                }
              }
            }),
            new MenuItemUpload({
              title: t(
                'context_menu.edit.items.insert_image.items.import.title'
              ),
              accept: [
                'image/png',
                'image/jpeg',
                'image/webp',
                'image/svg+xml'
              ],
              multiple: true,
              action({ files }) {
                files?.forEach(async file => {
                  if (file.type.startsWith('image/')) {
                    let blob;
                    if (file.type.includes('svg')) {
                      blob = await imageToBlob(
                        await loadImage(URL.createObjectURL(file))
                      );
                    } else {
                      blob = await blobFromFile(file);
                    }

                    model.actions.openInsertImage(blob);
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
      title: t('context_menu.color_palette.title'),
      items: [
        new MenuItemInteraction({
          title: t('context_menu.color_palette.items.settings.title'),
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
      title: t('context_menu.display.title'),
      items: [
        new MenuItemInteraction({
          title: t('context_menu.display.items.grid.title'),
          action() {
            return model.actions?.openGridSettings();
          }
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          title: t('context_menu.display.items.split.title'),
          items: [
            new MenuItemInteraction({
              title: t(
                'context_menu.display.items.split.items.one_display.title'
              ),
              action() {
                return model.app.setDisplays(1);
              }
            }),
            new MenuItemInteraction({
              title: t(
                'context_menu.display.items.split.items.two_displays.title'
              ),
              action() {
                return model.app.setDisplays(2);
              }
            }),
            new MenuItemInteraction({
              title: t(
                'context_menu.display.items.split.items.three_displays.title'
              ),
              action() {
                return model.app.setDisplays(3);
              }
            }),
            new MenuItemInteraction({
              title: t(
                'context_menu.display.items.split.items.four_displays.title'
              ),
              action() {
                return model.app.setDisplays(4);
              }
            })
          ]
        }),
        new MenuItemInteraction({
          title: t('context_menu.display.items.reset.title'),
          items: [
            new MenuItemInteraction({
              title: t('context_menu.display.items.reset.items.all.title'),
              action() {
                return Promise.all([
                  model.app.currentDisplay?.actions.setPosition(ipoint(0, 0)),
                  model.app.currentDisplay?.actions.setZoom(ipoint(0, 0), 0)
                ]);
              }
            }),
            new MenuItemSeparator(),
            new MenuItemInteraction({
              title: t('context_menu.display.items.reset.items.position.title'),
              action() {
                return model.app.currentDisplay?.actions.setPosition(
                  ipoint(0, 0)
                );
              }
            }),
            new MenuItemInteraction({
              title: t('context_menu.display.items.reset.items.zoom.title'),
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
