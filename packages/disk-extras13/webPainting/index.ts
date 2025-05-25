import { reactive, type Reactive } from 'vue';
import { ipoint } from '@js-basics/vector';

import App from './lib/App';
import Bounds from './lib/Bounds';
import { CONFIG_NAMES, type Model, type Options } from './types';
import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { SYMBOL } from '../types';
import type Window from '@web-workbench/core/classes/Window';
import Color from './lib/Color';

export default defineFileItems(({ core }) => {
  let infoWindow: Window | undefined;
  let documentSettingsWindow: Window | undefined;
  let displaySettingsWindow: Window | undefined;

  return [
    {
      meta: [[ITEM_META.SYMBOL, SYMBOL.WEB_PAINTING]],
      id: 'WebPainting.app',
      name: 'WebPainting',
      createdDate: new Date(2017, 7, 5).getTime(),
      editedDate: new Date(2020, 3, 14).getTime(),
      async action() {
        const executionResolve = core.addExecution();

        const contentLayout = core.modules.screen?.contentLayout;
        if (!contentLayout) {
          throw new Error('Content layout not found');
        }

        const app = new App(
          new Bounds(
            contentLayout.position,
            ipoint(() => contentLayout.position + contentLayout.size)
          )
        );

        app.options.display.background = core.config.get(
          CONFIG_NAMES.WEB_PAINTING_DISPLAY_BACKGROUND
        );
        app.options.display.foreground = core.config.get(
          CONFIG_NAMES.WEB_PAINTING_DISPLAY_FOREGROUND
        );

        const model = reactive<Model>({
          fsItem: undefined,
          app
        });

        const mainWindow = core.modules.windows?.addWindow(
          {
            component: await import('./components/WebPainting.vue').then(
              module => module.default
            ),
            componentData: {
              model,
              setApp: (app: App) => {
                model.app = app;
              }
            },
            options: {
              title: 'WebPainting - Extras 1.3',
              scaleX: false,
              scaleY: false,
              scrollX: false,
              scrollY: false,
              embed: true
            }
          },
          {
            group: 'extras13WebPainting',
            full: true
          }
        );

        model.actions = {
          openInfo: () => openInfo(model),
          openDocumentSettings: () => openDocumentSettings(model),
          openDisplaySettings: () => openDisplaySettings(model),
          close: () => {
            mainWindow?.close();
          },
          focus: () => {
            mainWindow?.focus();
          }
        };

        mainWindow?.awaitClose().then(() => {
          infoWindow?.close();
          documentSettingsWindow?.close();
          displaySettingsWindow?.close();
        });

        executionResolve();
      }
    }
  ];

  async function openInfo(model: Reactive<Model>) {
    if (infoWindow) {
      return infoWindow;
    }
    infoWindow = core.modules.windows?.addWindow(
      {
        component: await import('./components/Info.vue').then(
          module => module.default
        ),
        componentData: { model },
        options: {
          title: 'Info'
        }
      },
      {
        group: 'extras13WebPainting'
      }
    );

    infoWindow?.awaitClose().then(() => {
      infoWindow = undefined;
    });
    return infoWindow;
  }

  async function openDocumentSettings(model: Reactive<Model>) {
    const app = model.app;
    documentSettingsWindow = core.modules.windows?.addWindow(
      {
        component: await import(
          './components/webPainting/DocumentSettings.vue'
        ).then(module => module.default),
        componentData: {
          model: {
            paletteSteps: app.colorSelect.paletteSteps.toJSON(),
            size: {
              width: app.canvas?.size.x || 0,
              height: app.canvas?.size.y || 0
            }
          }
        },
        options: {
          title: 'Document Settings'
        }
      },
      {
        group: 'extras13WebPainting'
      }
    );
    return documentSettingsWindow?.awaitClose().then(({ value }) => {
      documentSettingsWindow = undefined;
      if (value) {
        const { size, paletteSteps } = value as Options;
        app.colorSelect.paletteSteps = new Color(
          paletteSteps.red,
          paletteSteps.green,
          paletteSteps.blue
        );
        app.canvas?.setSize(Number(size.width), Number(size.height));
      }
    });
  }

  async function openDisplaySettings(model: Reactive<Model>) {
    const app = model.app;
    displaySettingsWindow = core.modules.windows?.addWindow(
      {
        component: await import(
          './components/webPainting/DisplaySettings.vue'
        ).then(module => module.default),
        componentData: {
          model: {
            background: app.options.display.background,
            foreground: app.options.display.foreground
          }
        },
        options: {
          title: 'Display Settings'
        }
      },
      {
        group: 'extras13WebPainting'
      }
    );

    return displaySettingsWindow?.awaitClose().then(({ value }) => {
      if (value) {
        const { background, foreground } = value as Options;
        core.config.set(
          CONFIG_NAMES.WEB_PAINTING_DISPLAY_BACKGROUND,
          background
        );
        core.config.set(
          CONFIG_NAMES.WEB_PAINTING_DISPLAY_FOREGROUND,
          foreground
        );
        Object.assign(app.options.display, { background, foreground });
      }
    });
  }
});
