import type { TOOLS } from '@web-workbench/disk-web-paint/webPaint/types/select';
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
  getDocumentFromFile,
  getDocumentFromImage
} from './lib/utils/document';
import type Core from '@web-workbench/core/classes/Core';
import { Document } from './lib/classes/Document';
import { ipoint } from '@js-basics/vector';
import { imageDataToDataURI, loadImage } from '@web-workbench/core/utils/image';
import { saveFileDialog } from '@web-workbench/core/modules/Files/commands';
import { editfile } from '@web-workbench/core/modules/Files/commands/operations';
import {
  resizeCanvas,
  imageDataToCanvas
} from '@web-workbench/core/utils/canvas';
import theme, { getTheme } from './theme';
import type Event from '@web-workbench/core/classes/Event';

import { getAbstractTool } from './utils/tool';
import type Theme from '@web-workbench/core/classes/Theme';
import formats from './utils/formats';

export default defineFileItems(({ core }) => {
  let infoWindow: Window | undefined;
  let newWindow: Window | undefined;
  let exportWindow: Window | undefined;
  let settingsWindow: Window | undefined;
  let gridSettingsWindow: Window | undefined;
  let embedImageWindow: Window | undefined;
  let imageSharpnessWindow: Window | undefined;
  let colorPickerWindow: Window | undefined;
  let debugColorPickersWindow: Window | undefined;
  let debugcolorPaletteWindow: Window | undefined;
  let valueInputWindow: Window | undefined;

  return [
    {
      meta: [[ITEM_META.SYMBOL, SYMBOL.WEB_PAINT]],
      id: 'WebPaint.app',
      name: 'Web Paint',
      createdDate: new Date(2017, 7, 5).getTime(),
      editedDate: new Date(2025, 5, 29).getTime(),
      async action() {
        // const executionResolve = core.addExecution();

        const contentLayout = core.modules.screen?.contentLayout;
        if (!contentLayout) {
          throw new Error('Content layout not found');
        }

        const test = new App(
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
          app: test,
          actions: getActions(test)
        });

        const app = model.app;
        await app.setup();

        app.workerManager.ready.then(async () => {
          app.setDocument(getDocumentByFormat(formats[4].formats[2]));
          // app.setDocument(getBlankDocument(ipoint(256, 256)));
          // app.setDocument(getBlankDocument(ipoint(1920, 1080)));
          // app.setDocument(await getDocumentFromUrl(DEMO_IMAGES.WEB_PAINTING));
          // app.setDocument(await getDocumentFromUrl(DEMO_IMAGES.WEB_PAINTING));
        });

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
              title: 'Web Paint',
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
            newWindow,
            exportWindow,
            settingsWindow,
            gridSettingsWindow,
            embedImageWindow,
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
              app.setDocument(await getDocumentFromFile(file));
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
              const imageData = await app.getImageData();
              const canvas = await imageDataToCanvas(imageData);
              const blob = await canvas.convertToBlob({
                type: 'image/png'
              });
              await navigator.clipboard.write([
                new ClipboardItem({
                  'image/png': blob
                })
              ]);
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

            useAbstractTool: <TOptions extends ToolUseOptions>(
              tool: TOOLS,
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
            openNew: () => openNew(model),
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
            openResize: () => {
              return documentResize(core, model);
            },
            openResizeCanvas: () => {
              return documentResizeCanvas(core, model);
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

            openEmbedImage: (blob: Blob) => {
              return openEmbedImage(core, model, blob);
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
          title: 'Settings'
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
          title: 'Value Input',
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
          title: 'Info'
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

  async function openNew(model: Reactive<Model>) {
    if (newWindow) {
      return newWindow;
    }
    newWindow = core.modules.windows!.addWindow(
      {
        component: await import('./components/windows/New.vue').then(
          module => module.default
        ),
        componentData: { model },
        options: {
          title: 'New'
        }
      },
      {
        group: 'extras13WebPaint'
      }
    );

    newWindow.awaitClose().then(() => {
      newWindow = undefined;
    });
    return newWindow;
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
          title: 'Color Palette',
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
          title: 'Grid Settings'
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

  async function openEmbedImage(
    core: Core,
    model: Reactive<Model>,
    blob: Blob
  ) {
    if (embedImageWindow) {
      return embedImageWindow;
    }
    embedImageWindow = core.modules.windows!.addWindow(
      {
        component: await import('./components/windows/EmbedImage.vue').then(
          module => module.default
        ),
        componentData: {
          core,
          model,
          blob
        },
        options: {
          title: 'Embed Image'
        }
      },
      {
        group: 'extras13WebPaint'
      }
    );

    embedImageWindow.awaitClose().then(() => {
      embedImageWindow = undefined;
    });
    return embedImageWindow;
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
          title: 'Image Sharpness',
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
          title: 'Color Picker',
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
          title: 'Export'
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

  // #endregion
});

async function documentResize(core: Core, model: Reactive<Model>) {
  const window = core.modules.windows!.addWindow(
    {
      component: await import('./components/windows/DocumentResize.vue').then(
        module => module.default
      ),
      componentData: { model },
      options: {
        title: 'Document Resize'
      }
    },
    {
      group: 'extras13WebPaint'
    }
  );

  return window;
}
async function documentResizeCanvas(core: Core, model: Reactive<Model>) {
  const window = core.modules.windows!.addWindow(
    {
      component: await import(
        './components/windows/DocumentResizeCanvas.vue'
      ).then(module => module.default),
      componentData: { model },
      options: {
        title: 'Document Resize Canvas'
      }
    },
    {
      group: 'extras13WebPaint'
    }
  );

  return window;
}

async function save(core: Core, model: Reactive<Model>, saveAs = false) {
  const imageData = await model.app.getImageData();
  const content = await imageDataToDataURI(imageData);

  let value = Object.assign({
    [PROPERTY.OUTPUT_TYPE]: 'image',
    [PROPERTY.CONTENT]: content
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
      extension: 'img'
    });
    return model.fsItem;
  }
}

async function open(core: Core, model: Reactive<Model>) {
  const data = await core.executeCommand('openFileDialog');
  if (data) {
    if (PROPERTY.CONTENT in data.value) {
      model.app.setDocument(
        await getDocumentFromImage(
          await loadImage(data.value[PROPERTY.CONTENT])
        )
      );
      model.fsItem = data.fsItem;
    } else {
      throw new Error("Can't read file content");
    }
  }
}
