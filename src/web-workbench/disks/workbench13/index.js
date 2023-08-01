import { filter } from 'rxjs/operators';
import { ipoint } from '@js-basics/vector';
import { markRaw, reactive } from 'vue';
import { ITEM_META } from '../../classes/FileSystem/Item';
import { SYMBOL } from '../../utils/symbols';

import {
  CONFIG_NAMES, CONFIG_DEFAULTS, DEFAULT_FONT,
  getDocumentModelValue,
  DEFAULT_FONT_SIZE,
  FONT_FAMILES
} from './utils';

import documentHelpContent from './document-help.md?raw';
import themeWhiteContrast from '@/web-workbench/themes/whiteContrast';
import { WINDOW_POSITION } from '@/web-workbench/classes/WindowWrapper';
import WbComponentsConsole from '@/components/environments/Console';

export default ({ core }) => {
  core.config.setDefaults(CONFIG_DEFAULTS);

  return {
    locked: true,
    meta: [
      [
        ITEM_META.SYMBOL, SYMBOL.DISK_WORKBENCH13
      ],
      [
        ITEM_META.WINDOW_SIZE, ipoint(400, 290)
      ],
      [
        ITEM_META.WINDOW_POSITION, ipoint(40, 90)
      ],
      [
        ITEM_META.WINDOW_SYMBOL_REARRANGE, true
      ]
    ],
    name: 'Workbench 1.3',
    items: [

      {
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.CONSOLE
          ],
          [
            ITEM_META.WINDOW_SIZE, ipoint(360, 200)
          ]
        ],
        id: 'Shell.app',
        name: 'Shell',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action ({ modules }) {
          const window = modules.windows.addWindow({
            title: 'Shell',
            component: WbComponentsConsole,
            componentData: {
              showIntroduction: true
            },
            options: {
              scale: true,
              scrollX: true,
              scrollY: true
            },
            layout: {
              size: ipoint(540, 360)
            }
          },
          {
            group: 'workbench13Shell'
          });
          return new Promise((resolve) => {
            window.events.pipe(filter(({ name }) => name === 'close')).subscribe(() => {
              resolve();
            });
          });
        }
      },
      {
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.CLOUD_DISK
          ]
        ],
        id: 'Cloud.app',
        name: 'Cloud',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action: cloudAction(core)
      },
      {
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.FULLSCREEN
          ]
        ],
        id: 'Fullscreen.app',
        name: 'Fullscreen',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action () {
          return core.executeCommand('fullscreen -toggle');
        }
      },
      {
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.CLOCK
          ]
        ],
        id: 'Clock.app',
        name: 'Clock',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action: clockAction(core)
      },
      {
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.CALCULATOR
          ]
        ],
        id: 'Calculator.app',
        name: 'Calculator',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action: calculatorAction(core)
      },
      {
        id: 'Others',
        name: 'Others',
        meta: [
          [
            ITEM_META.WINDOW_SIZE, ipoint(160, 120)
          ],
          [
            ITEM_META.WINDOW_SYMBOL_REARRANGE, true
          ]
        ],
        createdDate: new Date(2020, 4, 16).getTime(),
        editedDate: new Date(2020, 4, 17).getTime(),
        items: [
          {
            meta: [
              [
                ITEM_META.SYMBOL, SYMBOL.CONSOLE
              ],
              [
                ITEM_META.WINDOW_SIZE, ipoint(360, 200)
              ]
            ],
            id: 'Shell_Fullscreen.app',
            name: 'Shell Fullscreen',
            createdDate: new Date(2017, 7, 5).getTime(),
            editedDate: new Date(2020, 3, 14).getTime(),
            action ({ modules }) {
              const window = modules.windows.addWindow({
                title: 'Shell',
                component: WbComponentsConsole,
                componentData: {
                  showIntroduction: true
                },
                options: {
                  scale: true,
                  scrollX: true,
                  scrollY: true
                },
                layout: {
                  size: ipoint(540, 360)
                }
              },
              {
                group: 'workbench13Shell',
                full: true
              });
              return new Promise((resolve) => {
                window.events.pipe(filter(({ name }) => name === 'close')).subscribe(() => {
                  resolve();
                });
              });
            }
          }
        ]
      },

      {
        id: 'Prefs',
        name: 'Prefs',
        createdDate: new Date(2020, 4, 16).getTime(),
        editedDate: new Date(2020, 4, 17).getTime(),
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.DIRECTORY_PREFS
          ],
          [
            ITEM_META.WINDOW_SIZE, ipoint(160, 200)
          ],
          [
            ITEM_META.WINDOW_SYMBOL_REARRANGE, true
          ]
        ],
        items: [

          {
            meta: [
              [
                ITEM_META.SYMBOL, SYMBOL.SETTINGS
              ],
              [
                ITEM_META.WINDOW_SIZE, ipoint(360, 200)
              ]
            ],
            id: 'Settings.ref',
            name: 'Settings',
            createdDate: new Date(2017, 7, 5).getTime(),
            editedDate: new Date(2020, 3, 14).getTime(),
            action () {
              return core.executeCommand('openSettings');
            }
          },
          {
            meta: [
              [
                ITEM_META.SYMBOL, SYMBOL.PALETTE
              ],
              [
                ITEM_META.WINDOW_SIZE, ipoint(360, 200)
              ]
            ],
            id: 'ColorSettings.app',
            name: 'Color Settings',
            createdDate: new Date(2017, 7, 5).getTime(),
            editedDate: new Date(2020, 3, 14).getTime(),
            action () {
              return core.executeCommand('openColorSettings');
            }
          }

        ]
      },
      {
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.DOCUMENT_READER
          ],
          [
            ITEM_META.WINDOW_SIZE, ipoint(360, 200)
          ]
        ],
        id: 'DocumentReader.app',
        name: 'Document Reader',
        createdDate: new Date(2020, 4, 16).getTime(),
        editedDate: new Date(2020, 4, 17).getTime(),
        action: documentReaderAction(core)
      },
      {
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.DOCUMENT_EDITOR
          ],
          [
            ITEM_META.WINDOW_SIZE, ipoint(360, 200)
          ]
        ],
        id: 'DocumentEditor.app',
        name: 'Document Editor',
        createdDate: new Date(2020, 4, 16).getTime(),
        editedDate: new Date(2020, 4, 17).getTime(),
        action: documentEditorAction(core)
      },
      {
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.LARGE_NOTE_RICH
          ]
        ],
        id: 'Document_Help.md',
        name: 'Document Help',
        createdDate: new Date(2020, 4, 16).getTime(),
        editedDate: new Date(2020, 4, 17).getTime(),
        data: {
          openMaximized: true,
          type: 'markdown',
          content: documentHelpContent,
          fontFamily: FONT_FAMILES.SansSerif['Comic Sans MS'],
          fontSize: DEFAULT_FONT_SIZE
        }
      }
    ]
  };
};

function clockAction (core) {
  return async ({ modules }) => {
    const executionResolve = core.addExecution();
    const [
      component
    ] = await Promise.all([
      import('@/components/disks/workbench13/Clock').then(module => module.default)
    ]);
    modules.windows.addWindow({
      title: 'Clock',
      component,
      componentData: {},
      options: {
        scale: false,
        scrollX: false,
        scrollY: false
      }
    }, {
      group: 'workbench13Clock'
    });
    executionResolve();
  };
}

function calculatorAction (core) {
  return async ({ modules }) => {
    const executionResolve = core.addExecution();
    const [
      component
    ] = await Promise.all([
      import('@/components/disks/workbench13/Calculator').then(module => module.default)
    ]);
    modules.windows.addWindow({
      title: 'Calculator',
      component,
      componentData: {},
      options: {
        scale: false,
        scrollX: false,
        scrollY: false
      }
    },
    {
      group: 'workbench13Calculator'
    });
    executionResolve();
  };
}

function cloudAction (core) {
  return async ({ modules }) => {
    async function updateItems (model) {
      model.items = (await core.executeCommand('cloudList -json')).map(markRaw);
    }

    function hasError (value) {
      if (value instanceof Error) {
        return core.executeCommand(`openDialog "${value.message}" --title="${value.code}"`);
      }
    }

    const model = reactive({ actions: {}, id: null, items: [] });
    model.actions.login = async (email, password, storageId) => {
      await hasError(await core.executeCommand(`cloudAuth -login --email="${email}" --password="${password}" --storage="${storageId}"`));
      return updateItems(model);
    };
    model.actions.logout = async (id) => {
      await hasError(await core.executeCommand(`cloudAuth --storage="${id}" -logout `));
      return updateItems(model);
    };
    model.actions.connect = async (id, apiKey, url) => {
      await hasError(await core.executeCommand(`cloudMount "CD${id.replace(/^(CD|cd)/, '')}" --apiKey="${apiKey}" --url="${url}"`));
      return updateItems(model);
    };
    model.actions.disconnect = async (id) => {
      await hasError(await core.executeCommand(`cloudUnmount "${id}"`));
      return updateItems(model);
    };

    const executionResolve = core.addExecution();

    modules.files.fs.root.events.subscribe(({ name }) => {
      switch (name) {
        case 'addItem':
        case 'removeItem':
          return updateItems(model);
      }
    });
    await updateItems(model);

    const [
      component
    ] = await Promise.all([
      import('@/components/disks/workbench13/Cloud').then(module => module.default)
    ]);

    modules.windows.addWindow({
      title: 'Cloud',
      component,
      componentData: { model },
      options: {
        scale: false,
        scrollX: false,
        scrollY: false
      }
    },
    {
      group: 'workbench13Cloud'
    });
    executionResolve();
  };
}

// Document Editor & Reader

function documentEditorAction (core) {
  const windowsModule = core.modules.windows;
  return async ({ modules }, path) => {
    const executionResolve = core.addExecution();
    const [
      WbComponentsDocumentEditor,
      WbComponentsDocumentEditorPreview
    ] = await Promise.all([
      import('@/components/disks/workbench13/DocumentEditor').then(module => module.default),
      import('@/components/disks/workbench13/documentEditor/Preview').then(module => module.default)
    ]);

    let model = {
      actions: {},
      value: getDocumentModelValue(),
      fsItem: null,
      [CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW]: core.config.get(CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW)
    };

    if (path) {
      const fsItem = markRaw(await modules.files.fs.get(path));
      const value = Object.assign(model.value, getDocumentModelValue(), fsItem.data);
      model = Object.assign(model, {
        fsItem,
        value
      });
    }

    const editorWindow = modules.windows.addWindow({
      title: 'Document Editor',
      component: WbComponentsDocumentEditor,
      componentData: { model },
      options: {
        scale: false,
        scrollX: true,
        scrollY: true,
        center: false,
        embed: true,
        borderless: true
      },
      layout: {
        size: ipoint(540, 360)
      }
    }, {
      group: 'workbench13DocumentEditor',
      full: true
    });

    Object.assign(model.actions, {
      close: () => {
        editorWindow.close();
      },
      focus: () => {
        editorWindow.focus();
      },
      reset: () => {
        model.value = getDocumentModelValue();
        model.fsItem = null;
      }
    });

    let previewWindow;
    model.actions.togglePreview = (toggle = true) => {
      if (toggle) {
        previewWindow = modules.windows.addWindow({
          title: 'Preview - Document Editor',
          component: WbComponentsDocumentEditorPreview,
          componentData: { model },
          options: {
            scale: false,
            scrollX: true,
            scrollY: true,
            center: false,
            close: false,
            embed: true,
            borderless: true
          },
          layout: {
            size: ipoint(540, 360)
          }
        }, {
          group: 'workbench13DocumentEditor',
          active: false
        });
        window.requestAnimationFrame(() => {
          windowsModule.contentWrapper.setWindowPositions(WINDOW_POSITION.SPLIT_HORIZONTAL, [
            editorWindow, previewWindow
          ]);
        }, 0);
      } else if (previewWindow) {
        editorWindow.unfocus();
        previewWindow.close();
        window.requestAnimationFrame(() => {
          windowsModule.contentWrapper.setWindowPositions(WINDOW_POSITION.SPLIT_HORIZONTAL, [
            editorWindow
          ]);
          editorWindow.focus();
        });
      }
    };

    core.modules.screen.setTheme(themeWhiteContrast);

    return new Promise((resolve) => {
      executionResolve();
      editorWindow.events.pipe(filter(({ name }) => name === 'close')).subscribe(() => {
        if (previewWindow) {
          previewWindow.close();
        }
        core.modules.screen.setTheme(null);
        resolve();
      });
    });
  };
};

function documentReaderAction (core) {
  return async ({ modules }, path) => {
    let fsItem; let model = reactive({
      actions: {},
      fsItem: null,
      value: getDocumentModelValue(),
      fontFamily: DEFAULT_FONT
    });
    if (path) {
      fsItem = markRaw(await modules.files.fs.get(path));
      const value = Object.assign(model.value, getDocumentModelValue(), fsItem.data);
      model = {
        ...model,
        fsItem,
        value
      };
    }
    const executionResolve = core.addExecution();
    const [
      component
    ] = await Promise.all([
      import('@/components/disks/workbench13/DocumentReader').then(module => module.default)
    ]);

    const window = modules.windows.addWindow({
      title: 'Document Reader',
      component,
      componentData: { model },
      options: {
        scale: true,
        scrollX: false,
        scrollY: false
      }
    }, {
      full: true,
      group: 'workbench13DocumentReader'
    });

    Object.assign(model.actions, {
      close: () => {
        window.close();
      },
      focus: () => {
        window.focus();
      }
    });
    executionResolve();
  };
}
