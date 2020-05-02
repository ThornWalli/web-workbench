import { ipoint } from '@js-basics/vector';
import { ITEM_META } from '../../classes/FileSystem/Item';
import { SYMBOL } from '../../utils/symbols';

import WbComponentsConsole from '@/components/environments/Console';
import { WINDOW_POSITION } from '@/web-workbench/classes/WindowWrapper';
import themeWhite from '@/web-workbench/themes/white';

export const CONFIG_NAMES = {
  EDITOR_SHOW_PREVIEW: 'workbench13_editor_show_preview'
};

export const CONFIG_DEFAULTS = {
  [CONFIG_NAMES.EDITOR_SHOW_PREVIEW]: true
};

export const PROPERTY = {
  OUTPUT_TYPE: 'type',
  OPEN_MAXIMIZED: 'openMaximized',
  CONTENT: 'content'
};

export default ({ core }) => {
  core.config.setDefaults(CONFIG_DEFAULTS);

  return {
    locked: true,
    meta: [
      [
        ITEM_META.SYMBOL, SYMBOL.DISK_WORKBENCH13
      ],
      [
        ITEM_META.WINDOW_SIZE, ipoint(360, 200)
      ],
      [
        ITEM_META.SORT_SYMBOLS, true
      ]
    ],
    name: 'Workbench 1.3',
    items: [

      {
        locked: true,
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.CONSOLE
          ],
          [
            ITEM_META.WINDOW_SIZE, ipoint(360, 200)
          ]
        ],
        id: 'Shell_Fullscreen.info',
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
          }, {
            full: true
          });
          return new Promise((resolve) => {
            window.events.subscribe(({ name }) => {
              if (name === 'close') {
                resolve();
              }
            });
          });
        }
      },

      {
        locked: true,
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.CONSOLE
          ],
          [
            ITEM_META.WINDOW_SIZE, ipoint(360, 200)
          ]
        ],
        id: 'Shell.info',
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
          });
          return new Promise((resolve) => {
            window.events.subscribe(({ name }) => {
              if (name === 'close') {
                resolve();
              }
            });
          });
        }
      },
      {
        locked: true,
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.CLOUD_DISK
          ]
        ],
        id: 'Cloud.info',
        name: 'Cloud',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action: cloudAction(core)
      },
      {
        locked: true,
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.FULLSCREEN
          ]
        ],
        id: 'Fullscreen.info',
        name: 'Fullscreen',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action () {
          return core.executeCommand('fullscreen -toggle');
        }
      },

      {
        locked: true,
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.CONSOLE
          ],
          [
            ITEM_META.WINDOW_SIZE, ipoint(360, 200)
          ]
        ],
        id: 'Editor.info',
        name: 'Editor',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action: editorAction(core)
      },
      {
        locked: true,
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.CLOCK
          ]
        ],
        id: 'Clock.info',
        name: 'Clock',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action: clockAction(core)
      },
      {
        locked: true,
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.CALCULATOR
          ]
        ],
        id: 'Calculator.info',
        name: 'Calculator',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action: calculatorAction(core)
      },
      {
        locked: true,
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.SETTINGS
          ],
          [
            ITEM_META.WINDOW_SIZE, ipoint(360, 200)
          ]
        ],
        id: 'Settings.info',
        name: 'Settings',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action () {
          return core.executeCommand('openSettings');
        }
      },
      {
        locked: true,
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.COLORS
          ],
          [
            ITEM_META.WINDOW_SIZE, ipoint(360, 200)
          ]
        ],
        id: 'ColorSettings.info',
        name: 'Color Settings',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action ({ modules }) {
          return core.executeCommand('openColorSettings');
        }
      }
    ]
  };
};

function editorAction (core) {
  const windowsModule = core.modules.windows;
  return async ({ modules }) => {
    const executionResolve = core.addExecution();
    const [
      WbComponentsEditor,
      WbComponentsEditorPreview
    ] = await Promise.all([
      import('@/components/disks/workbench13/Editor').then(module => module.default),
      import('@/components/disks/workbench13/editor/Preview').then(module => module.default)
    ]);

    function getValue () {
      return {
        [PROPERTY.OPEN_MAXIMIZED]: false,
        [PROPERTY.OUTPUT_TYPE]: 'markdown',
        [PROPERTY.CONTENT]: ''
      };
    }

    const model = {
      actions: {},
      value: getValue(),
      fsItem: null,
      [CONFIG_NAMES.EDITOR_SHOW_PREVIEW]: core.config.get(CONFIG_NAMES.EDITOR_SHOW_PREVIEW)
    };

    const window = modules.windows.addWindow({
      title: 'Editor',
      component: WbComponentsEditor,
      componentData: { model },
      options: {
        scale: false,
        scrollX: true,
        scrollY: true,
        embed: true
      },
      layout: {
        size: ipoint(540, 360)
      }
    }, { full: true });

    model.reset = () => {
      model.value = getValue();
      model.fsItem = null;
    };

    let previewWindow;
    model.actions.togglePreview = (toggle = true) => {
      if (toggle) {
        previewWindow = modules.windows.addWindow({
          title: 'Editor - Preview',
          component: WbComponentsEditorPreview,
          componentData: { model },
          options: {
            scale: false,
            scrollX: true,
            scrollY: true,
            close: false,
            embed: true
          },
          layout: {
            size: ipoint(540, 360)
          }
        }, {
          active: false
        });
        global.requestAnimationFrame(() => {
          windowsModule.contentWrapper.setWindowPositions(WINDOW_POSITION.SPLIT_HORIZONTAL, [
            window, previewWindow
          ]);
        }, 0);
      } else if (previewWindow) {
        window.unfocus();
        previewWindow.close();
        global.requestAnimationFrame(() => {
          windowsModule.contentWrapper.setWindowPositions(WINDOW_POSITION.SPLIT_HORIZONTAL, [
            window
          ]);
          window.focus();
        });
      }
    };

    Object.assign(model.actions, {
      close: () => {
        window.close();
      },
      focus: () => {
        window.focus();
      }
    });

    core.modules.screen.setTheme(themeWhite);

    return new Promise((resolve) => {
      executionResolve();
      window.events.subscribe(({ name }) => {
        if (name === 'close') {
          if (previewWindow) {
            previewWindow.close();
          }
          core.modules.screen.setTheme(null);
          resolve();
        }
      });
    });
  };
}

function clockAction (core) {
  return async ({ modules }) => {
    const executionResolve = core.addExecution();
    const [
      WbClock
    ] = await Promise.all([
      import('@/components/disks/workbench13/Clock').then(module => module.default)
    ]);
    modules.windows.addWindow({
      title: 'Clock',
      component: WbClock,
      componentData: {},
      options: {
        scale: false,
        scrollX: false,
        scrollY: false
      }
    });
    executionResolve();
  };
}

function calculatorAction (core) {
  return async ({ modules }) => {
    const executionResolve = core.addExecution();
    const [
      WbCalculator
    ] = await Promise.all([
      import('@/components/disks/workbench13/Calculator').then(module => module.default)
    ]);
    modules.windows.addWindow({
      title: 'Calculator',
      component: WbCalculator,
      componentData: {},
      options: {
        scale: false,
        scrollX: false,
        scrollY: false
      }
    });
    executionResolve();
  };
}

function cloudAction (core) {
  return async ({ modules }) => {
    async function updateItems (model) {
      model.items = await core.executeCommand('cloudList -json');
    }

    function hasError (value) {
      if (value instanceof Error) {
        return core.executeCommand(`openDialog "${value.message}" --title="${value.code}"`);
      }
    }

    const model = { actions: {}, id: null, items: [] };
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
      WbCloud
    ] = await Promise.all([
      import('@/components/disks/workbench13/Cloud').then(module => module.default)
    ]);
    modules.windows.addWindow({
      title: 'Cloud',
      component: WbCloud,
      componentData: { model },
      options: {
        scale: false,
        scrollX: false,
        scrollY: false
      }
    });
    executionResolve();
  };
}
