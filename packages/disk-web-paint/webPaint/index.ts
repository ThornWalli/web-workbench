import type { TOOL } from '@web-workbench/disk-web-paint/webPaint/types/select';
import type { ToolUseOptions } from './lib/classes/Tool';
import { reactive } from 'vue';
import type { Reactive } from 'vue';
import { CONFIG_NAMES, PROPERTY } from './types';
import type {
  PromptOptions,
  ExportOptions,
  Model,
  ModelActions
} from './types';
import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { SYMBOL } from '../types';
import './types/theme';
import type Window from '@web-workbench/core/classes/Window';
import { App } from './lib/App';
import Color from './lib/classes/Color';
import {
  getDefaultBrushSelect,
  getDefaultColorSelect,
  getDefaultToolSelect
} from './lib/utils/select';
import {
  getDocumentByFormat,
  getDocumentFromBlob,
  getDocumentFromImageFile
} from './lib/utils/document';
import type Core from '@web-workbench/core/classes/Core';
import { Document } from './lib/classes/Document';
import { ipoint } from '@js-basics/vector';
import { imageDataToDataURI, loadImage } from '@web-workbench/core/utils/image';
import { saveFileDialog } from '@web-workbench/core/modules/Files/commands';
import { editfile } from '@web-workbench/core/modules/Files/commands/operations';
import {
  resizeCanvas,
  imageDataToCanvas,
  imageToCanvas
} from '@web-workbench/core/utils/canvas';
import theme, { getTheme } from './theme';
import type Event from '@web-workbench/core/classes/Event';

import { getAbstractTool } from './utils/tool';
import type Theme from '@web-workbench/core/classes/Theme';
import formats from './utils/formats';
import useI18n from './composables/useI18n';

import { formatFilenameDate } from '@web-workbench/core/utils/date';

import type { DocumentFile, DocumentLayer } from './types/document';
import { snakeCase } from 'change-case';
import { imageDataFromUint8Array } from '@web-workbench/core/utils/imageData';
import { copyImageToClipboard } from './lib/utils/clipboard';

export default defineFileItems(({ core }) => {
  let infoWindow: Window | undefined;
  let helpWindow: Window | undefined;
  let newDocumentWindow: Window | undefined;
  let exportWindow: Window | undefined;
  let settingsWindow: Window | undefined;
  let gridSettingsWindow: Window | undefined;
  let insertImageWindow: Window | undefined;
  let imageSharpnessWindow: Window | undefined;
  let colorPickerWindow: Window | undefined;
  let debugColorPickersWindow: Window | undefined;
  let debugcolorPaletteWindow: Window | undefined;
  let valueInputWindow: Window | undefined;

  const { t } = useI18n();

  return [
    {
      meta: [[ITEM_META.SYMBOL, SYMBOL.WEB_PAINT]],
      id: 'WebPaint.app',
      name: 'Web Paint',
      createdDate: new Date(2017, 7, 5).getTime(),
      editedDate: new Date(2025, 5, 29).getTime(),
      async action() {
        const executionResolve = core.addExecution();

        const contentLayout = core.modules.screen?.contentLayout;
        if (!contentLayout) {
          throw new Error('Content layout not found');
        }

        const rawApp = new App(
          {
            options: {
              select: {
                brush: getDefaultBrushSelect(),
                tool: getDefaultToolSelect(),
                color: getDefaultColorSelect()
              },
              display: {
                colors: {
                  background: Color.fromHex(
                    core.config.get(CONFIG_NAMES.WEB_PAINT_DISPLAY_BACKGROUND)
                  ),
                  foreground: Color.fromHex(
                    core.config.get(CONFIG_NAMES.WEB_PAINT_DISPLAY_FOREGROUND)
                  )
                },
                grid: {
                  color: Color.fromHex(
                    core.config.get(CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_COLOR)
                  ),
                  lineWidth: core.config.get(
                    CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_LINE_WIDTH
                  ),
                  visibleCount: core.config.get(
                    CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_VISIBLE_COUNT
                  )
                }
              }
            }
          },
          core.config
        );
        const model = reactive<Model>({
          fsItem: undefined,
          app: rawApp,
          actions: getActions(rawApp)
        });
        const app = model.app;

        await app.setup();

        const hasDebug =
          core!.config.get<boolean>(CONFIG_NAMES.WEB_PAINT_DEBUG) || false;

        await app.workerManager.ready.then(async () => {
          if (hasDebug) {
            app.setDocument(getDocumentByFormat(formats[5].formats[2]));
          }
          // app.setDocument(getBlankDocument(ipoint(256, 256)));
          // app.setDocument(getBlankDocument(ipoint(1920, 1080)));
          // app.setDocument(await getDocumentFromUrl(DEMO_IMAGES.WEB_PAINTING));
          // app.setDocument(await getDocumentFromUrl(DEMO_IMAGES.WEB_PAINTING));
        });

        executionResolve();

        const mainWindow = core.modules.windows!.addWindow(
          {
            component: await import('./components/App.vue').then(
              module => module.default
            ),
            componentData: {
              core,
              model
            },
            options: {
              title: t('window.general.title'),
              embed: true,
              borderless: true
            }
          },
          {
            group: 'extras13WebPaint',
            full: true
          }
        );

        model.actions.setTheme(theme);

        mainWindow.awaitClose().then(() => {
          [
            infoWindow,
            newDocumentWindow,
            exportWindow,
            settingsWindow,
            gridSettingsWindow,
            insertImageWindow,
            imageSharpnessWindow,
            colorPickerWindow,
            debugColorPickersWindow,
            debugcolorPaletteWindow,
            valueInputWindow
          ].forEach(window => window?.close());
          core.modules.screen?.setTheme(undefined);
        });

        function getActions(app: App): ModelActions {
          const actions: ModelActions = {
            setTheme: (theme?: Theme) => {
              if (
                core.config.get(CONFIG_NAMES.WEB_PAINT_NATIVE_THEME) &&
                core.modules.screen?.currentTheme
              ) {
                core.modules.screen.setTheme(
                  getTheme(core.modules.screen.currentTheme)
                );
              } else {
                core.modules.screen?.setTheme(theme);
              }
            },

            import: async file => {
              app.setDocument(await getDocumentFromImageFile(file));
            },

            export: async (options: ExportOptions) => {
              const FileSaver = await import('file-saver').then(
                module => module.default
              );
              try {
                const imageData = await app.getImageData();
                let canvas = await imageDataToCanvas(imageData);
                if (options.resize) {
                  canvas = await resizeCanvas(
                    canvas,
                    options.resize.x,
                    options.resize.y
                  );
                }
                const blob = await canvas.convertToBlob({
                  type: options.type,
                  quality: options.quality
                });
                const extname = options.type.split('/')[1] || 'png';
                const fileName =
                  (options.filename || `webpainting_${Date.now()}`) +
                  `.${extname}`;

                await FileSaver.saveAs(blob, fileName);
              } catch (error) {
                console.error('An error occurred during export.', error);
              }
            },

            importClipboard: async () => {
              const validMimeTypes = [
                'image/png',
                'image/jpeg',
                'image/webp',
                'image/gif'
              ];
              const items = await navigator.clipboard.read();
              const item = items.find(item =>
                item.types.find(type => validMimeTypes.includes(type))
              );
              if (item) {
                const blob = await item?.getType(item.types[0]);
                app.setDocument(await getDocumentFromBlob(blob));
              }
            },
            clipboardCopy: async () => {
              await copyImageToClipboard(await app.getImageData());
            },

            importDocument: async file => {
              return model.app.importDocument(file);
            },

            exportDocument: async () => {
              if (!app.currentDocument) {
                return;
              }

              const name = app.currentDocument.name;
              const blob = await app.exportDocument(app.currentDocument);

              const FileSaver = await import('file-saver').then(
                module => module.default
              );
              return FileSaver.saveAs(
                blob,
                `${formatFilenameDate(new Date())}_${snakeCase(name)}.wpd`
              );
            },

            useAbstractTool: <TOptions extends ToolUseOptions>(
              tool: TOOL,
              options: TOptions
            ) => {
              const ToolClass = getAbstractTool(tool);
              if (!ToolClass) {
                throw new Error(`Tool ${tool} is not implemented`);
              }
              const currentTool = new ToolClass({
                app: app,
                actions: actions
              });

              return currentTool.execute(options);
            },

            openValueInput: options => openValueInput(options),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            async prompt<Result = any>(options: PromptOptions) {
              return (await openValueInput(options))!.awaitClose<
                Event<Result>
              >();
            },
            openInfo: () => openInfo(model),
            openNewDocument: () => openNewDocument(model),
            openSettings: () => openSettings(model),
            openExport: () => openExport(model),
            close: () => {
              mainWindow?.close();
            },
            focus: () => {
              mainWindow?.focus();
            },

            newDocument: async options => {
              model.fsItem = undefined;
              await app.setDocument(
                new Document({
                  name: options?.name || 'New Document',
                  meta: {
                    colors: {
                      background: Color.fromHex(
                        core.config.get(
                          CONFIG_NAMES.WEB_PAINT_DOCUMENT_BACKGROUND
                        )
                      )
                    },
                    dimension: options?.dimension || ipoint(640, 480)
                  }
                })
              );
            },
            openDocument: async () => {
              await open(core, model);
            },
            openHelp: () => {
              return openHelp();
            },
            saveDocument: async () => {
              await save(core, model);
            },
            saveAsDocument: async () => {
              await save(core, model, true);
            },
            documentResize: async options => {
              const { payload } = await app.actions.resize(options);
              if (payload && model.app.currentDocument) {
                model.app.currentDocument?.setDimension(payload.dimension);
              }
            },
            documentResizeCanvas: async options => {
              const { payload } = await app.actions.resizeCanvas(options);
              if (payload && model.app.currentDocument) {
                model.app.currentDocument.setDimension(payload.dimension);
              }
            },
            openDocumentResize: () => {
              return openDocumentResize(core, model);
            },
            openDocumentResizeCanvas: () => {
              return openDocumentResizeCanvas(core, model);
            },
            openDocumentSettings: () => {
              return openDocumentSettings(core, model);
            },
            openColorPalette: () => {
              return openColorPalette(core, model);
            },
            openColorPicker: (color: Color) => {
              return openColorPicker(color);
            },

            openGridSettings: () => {
              return openGridSettings(core, model);
            },

            openInsertImage: (blob: Blob) => {
              return openInsertImage(core, model, blob);
            },

            openImageSharpness: () => {
              return openImageSharpness();
            },

            openDebugColorPickers: () => {
              return openDebugColorPickers();
            },
            openDebugColorPicker: () => {
              return openDebugcolorPaletteWindow();
            }
          };
          return actions;
        }
      }
    }
  ];

  async function openSettings(model: Reactive<Model>) {
    if (settingsWindow) {
      return settingsWindow;
    }
    settingsWindow = core.modules.windows!.addWindow(
      {
        component: await import('./components/windows/Settings.vue').then(
          module => module.default
        ),
        componentData: { model },
        options: {
          title: t('window.settings.title')
        }
      },
      {
        group: 'extras13WebPaint'
      }
    );

    settingsWindow.awaitClose().then(() => {
      settingsWindow = undefined;
    });
    return settingsWindow;
  }

  async function openValueInput(options?: {
    type?: 'text' | 'number' | 'password';
    value?: string | number;
    min?: number;
    max?: number;
    step?: number;
    size?: number;
    text?: string;
    required?: boolean;
  }) {
    if (valueInputWindow) {
      return valueInputWindow;
    }
    valueInputWindow = core.modules.windows!.addWindow(
      {
        component: await import('./components/windows/ValueInput.vue').then(
          module => module.default
        ),
        componentData: {
          ...options
        },
        options: {
          title: t('window.value_input.title'),
          embed: true,
          center: true,
          borderless: true,
          filled: true
        }
      },
      {
        group: 'extras13WebPaint'
      }
    );

    valueInputWindow.awaitClose().then(() => {
      valueInputWindow = undefined;
    });
    return valueInputWindow!;
  }

  async function openInfo(model: Reactive<Model>) {
    if (infoWindow) {
      return infoWindow;
    }
    infoWindow = core.modules.windows!.addWindow(
      {
        component: await import('./components/windows/Info.vue').then(
          module => module.default
        ),
        componentData: { model },
        options: {
          title: t('window.info.title')
        }
      },
      {
        group: 'extras13WebPaint'
      }
    );

    infoWindow.awaitClose().then(() => {
      infoWindow = undefined;
    });
    return infoWindow;
  }

  async function openHelp() {
    if (helpWindow) {
      return helpWindow;
    }
    helpWindow = core.modules.windows!.addWindow(
      {
        component: await import('./components/windows/Help.vue').then(
          module => module.default
        ),
        componentData: {},
        options: {
          title: t('window.help.title'),
          scrollY: true,
          scale: true
        },
        layout: {
          size: ipoint(360, 280)
        }
      },
      {
        group: 'extras13WebPaint'
      }
    );

    helpWindow.awaitClose().then(() => {
      helpWindow = undefined;
    });
    return helpWindow;
  }

  async function openNewDocument(model: Reactive<Model>) {
    if (newDocumentWindow) {
      return newDocumentWindow;
    }
    newDocumentWindow = core.modules.windows!.addWindow(
      {
        component: await import('./components/windows/NewDocument.vue').then(
          module => module.default
        ),
        componentData: { model },
        options: {
          title: t('window.new_document.title')
        }
      },
      {
        group: 'extras13WebPaint'
      }
    );

    newDocumentWindow.awaitClose().then(() => {
      newDocumentWindow = undefined;
    });
    return newDocumentWindow;
  }

  async function openColorPalette(core: Core, model: Reactive<Model>) {
    if (colorPickerWindow) {
      return colorPickerWindow;
    }
    colorPickerWindow = core.modules.windows!.addWindow(
      {
        component: await import('./components/windows/ColorPalette.vue').then(
          module => module.default
        ),
        componentData: {
          core,
          model
        },
        options: {
          title: t('window.color_palette.title'),
          filled: true
        }
      },
      {
        group: 'extras13WebPaint'
      }
    );

    colorPickerWindow.awaitClose().then(() => {
      colorPickerWindow = undefined;
    });
    return colorPickerWindow;
  }

  async function openGridSettings(core: Core, model: Reactive<Model>) {
    if (gridSettingsWindow) {
      return gridSettingsWindow;
    }
    gridSettingsWindow = core.modules.windows!.addWindow(
      {
        component: await import('./components/windows/GridSettings.vue').then(
          module => module.default
        ),
        componentData: {
          core,
          model
        },
        options: {
          title: t('window.grid_settings.title')
        }
      },
      {
        group: 'extras13WebPaint'
      }
    );

    gridSettingsWindow.awaitClose().then(() => {
      gridSettingsWindow = undefined;
    });
    return gridSettingsWindow;
  }

  async function openInsertImage(
    core: Core,
    model: Reactive<Model>,
    blob: Blob
  ) {
    if (insertImageWindow) {
      return insertImageWindow;
    }
    insertImageWindow = core.modules.windows!.addWindow(
      {
        component: await import('./components/windows/InsertImage.vue').then(
          module => module.default
        ),
        componentData: {
          core,
          model,
          blob
        },
        options: {
          title: t('window.insert_image.title')
        }
      },
      {
        group: 'extras13WebPaint'
      }
    );

    insertImageWindow.awaitClose().then(() => {
      insertImageWindow = undefined;
    });
    return insertImageWindow;
  }

  async function openImageSharpness() {
    if (imageSharpnessWindow) {
      return imageSharpnessWindow;
    }
    imageSharpnessWindow = core.modules.windows!.addWindow(
      {
        component: await import(
          './components/windows/imageOperation/Sharpness.vue'
        ).then(module => module.default),
        componentData: {},
        options: {
          title: t('window.image_sharpness.title'),
          filled: true
        }
      },
      {
        group: 'extras13WebPaint'
      }
    );
    imageSharpnessWindow.awaitClose().then(() => {
      imageSharpnessWindow = undefined;
    });
    return imageSharpnessWindow;
  }

  async function openColorPicker(color: Color) {
    if (colorPickerWindow) {
      return colorPickerWindow;
    }
    colorPickerWindow = core.modules.windows!.addWindow(
      {
        component: await import('./components/windows/ColorPicker.vue').then(
          module => module.default
        ),
        componentData: {
          color
        },
        options: {
          title: t('window.color_picker.title'),
          filled: true
        }
      },
      {
        group: 'extras13WebPaint'
      }
    );

    colorPickerWindow.awaitClose().then(() => {
      colorPickerWindow = undefined;
    });
    return colorPickerWindow;
  }

  async function openExport(model: Reactive<Model>) {
    if (exportWindow) {
      return exportWindow;
    }
    exportWindow = core.modules.windows!.addWindow(
      {
        component: await import('./components/windows/Export.vue').then(
          module => module.default
        ),
        componentData: { model },
        options: {
          title: t('window.export_document.title')
        }
      },
      {
        group: 'extras13WebPaint'
      }
    );

    exportWindow.awaitClose().then(() => {
      exportWindow = undefined;
    });
    return exportWindow;
  }

  // #region Debug

  async function openDebugColorPickers() {
    if (debugColorPickersWindow) {
      return debugColorPickersWindow;
    }
    debugColorPickersWindow = core.modules.windows!.addWindow(
      {
        component: await import(
          './components/windows/debug/ColorPickers.vue'
        ).then(module => module.default),
        componentData: {},
        options: {
          title: 'Debug Color Pickers',
          scrollY: true
        }
      },
      {
        group: 'extras13WebPaint'
      }
    );

    debugColorPickersWindow.awaitClose().then(() => {
      debugColorPickersWindow = undefined;
    });
    return debugColorPickersWindow;
  }

  async function openDebugcolorPaletteWindow() {
    if (debugcolorPaletteWindow) {
      return debugcolorPaletteWindow;
    }
    debugcolorPaletteWindow = core.modules.windows!.addWindow(
      {
        component: await import('./components/windows/ColorPicker.vue').then(
          module => module.default
        ),
        componentData: {},
        options: {
          title: 'Debug Color Picker',
          filled: true
        }
      },
      {
        group: 'extras13WebPaint'
      }
    );

    debugcolorPaletteWindow.awaitClose().then(() => {
      debugcolorPaletteWindow = undefined;
    });
    return debugcolorPaletteWindow;
  }

  async function openDocumentResize(core: Core, model: Reactive<Model>) {
    const window = core.modules.windows!.addWindow(
      {
        component: await import('./components/windows/DocumentResize.vue').then(
          module => module.default
        ),
        componentData: { model },
        options: {
          title: t('window.document_resize.title')
        }
      },
      {
        group: 'extras13WebPaint'
      }
    );

    return window;
  }
  async function openDocumentResizeCanvas(core: Core, model: Reactive<Model>) {
    const window = core.modules.windows!.addWindow(
      {
        component: await import(
          './components/windows/DocumentResizeCanvas.vue'
        ).then(module => module.default),
        componentData: { model },
        options: {
          title: t('window.document_resize_canvas.title')
        }
      },
      {
        group: 'extras13WebPaint'
      }
    );

    return window;
  }

  async function openDocumentSettings(core: Core, model: Reactive<Model>) {
    const window = core.modules.windows!.addWindow(
      {
        component: await import(
          './components/windows/DocumentSettings.vue'
        ).then(module => module.default),
        componentData: { model },
        options: {
          title: t('window.document_settings.title')
        }
      },
      {
        group: 'extras13WebPaint'
      }
    );

    return window;
  }

  // #endregion
});

async function save(core: Core, model: Reactive<Model>, saveAs = false) {
  const { payload } = await model.app.actions.getLayers();

  // 1 MB
  const maxFileSize = 1024 * 1024;
  payload.layers.reduce((acc, layer) => {
    if (acc + layer.buffer.byteLength > maxFileSize) {
      throw new Error(
        'Document size exceeds the maximum allowed size of 1 MB.'
      );
    }
    return acc + layer.buffer.byteLength;
  }, 0);

  const layers = await Promise.all(
    payload.layers.map(async layer => {
      const { buffer, dimension } = layer;
      return {
        ...layer,
        dataUri: await imageDataToDataURI(
          imageDataFromUint8Array(buffer, dimension)
        )
      };
    })
  );

  let value = Object.assign({
    [PROPERTY.OUTPUT_TYPE]: OUTPUT_TYPE,
    [PROPERTY.CONTENT]: {
      ...model.app.currentDocument.toJSON(),
      layers
    } as DocumentFile
  });
  value = await btoa(JSON.stringify(value));
  let item;
  if (!saveAs && model.fsItem) {
    item = await editfile(core, {
      path: model.fsItem.getPath(),
      data: value
    });
    if (item) {
      await core.executeCommand('openDialog "File saved."');
    } else {
      await core.executeCommand('openDialog "File could not be saved."');
    }
    return item;
  } else {
    model.fsItem = await saveFileDialog(core, {
      data: value,
      extension: 'wpd'
    });
    return model.fsItem;
  }
}

async function open(core: Core, model: Reactive<Model>) {
  const data = await core.executeCommand('openFileDialog');
  if (data) {
    if (PROPERTY.CONTENT in data.value) {
      const { name, meta, layers } = data.value[
        PROPERTY.CONTENT
      ] as DocumentFile;

      const preparedLayers: DocumentLayer[] = await Promise.all(
        layers.map(async (layer): Promise<DocumentLayer> => {
          const canvas = await imageToCanvas(await loadImage(layer.dataUri));
          const result = {
            ...layer
          };
          delete result.dataUri;
          return {
            ...result,
            imageBitmap: canvas.transferToImageBitmap()
          };
        })
      );

      model.app.setDocument(
        new Document({
          name,
          meta,
          layers: preparedLayers
        })
      );
    } else {
      throw new Error("Can't read file content");
    }
  }
}

const OUTPUT_TYPE = 'webPaintDocument';
