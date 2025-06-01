import { reactive, type Reactive } from 'vue';
import { CONFIG_NAMES, type Model } from './types';
import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { SYMBOL } from '../types';
import type Window from '@web-workbench/core/classes/Window';
import { App } from './lib/App';
import { Color } from './lib/classes/Color';
import {
  getDefaultBrushSelect,
  getDefaultColorSelect,
  getDefaultToolSelect
} from './lib/utils/select';
import { loadDocumentFromImage } from './lib/utils/document';
import { DEMO_IMAGES } from './utils';

export default defineFileItems(({ core }) => {
  let infoWindow: Window | undefined;

  return [
    {
      meta: [[ITEM_META.SYMBOL, SYMBOL.WEB_PAINTING]],
      id: 'WebPainting.app',
      name: 'WebPainting',
      createdDate: new Date(2017, 7, 5).getTime(),
      editedDate: new Date(2025, 5, 29).getTime(),
      async action() {
        const executionResolve = core.addExecution();

        const contentLayout = core.modules.screen?.contentLayout;
        if (!contentLayout) {
          throw new Error('Content layout not found');
        }
        const app = new App({
          options: {
            density: 1,
            select: {
              brush: getDefaultBrushSelect(),
              tool: getDefaultToolSelect(),
              color: getDefaultColorSelect()
            },
            display: {
              background: Color.fromHex(
                core.config.get(CONFIG_NAMES.WEB_PAINTING_DISPLAY_BACKGROUND)
              ),
              foreground: Color.fromHex(
                core.config.get(CONFIG_NAMES.WEB_PAINTING_DISPLAY_FOREGROUND)
              )
            }
          }
        });
        await app.setup();

        app.workerManager.ready.then(async () => {
          app.setDocument(await loadDocumentFromImage(DEMO_IMAGES.CUBY));
        });

        const model = reactive<Model>({
          app
        });

        const mainWindow = core.modules.windows?.addWindow(
          {
            component: await import('./components/App.vue').then(
              module => module.default
            ),
            componentData: {
              model
            },
            options: {
              title: 'WebPainting - Extras 1.3',
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
          close: () => {
            mainWindow?.close();
          },
          focus: () => {
            mainWindow?.focus();
          }
        };

        mainWindow?.awaitClose().then(() => {
          infoWindow?.close();
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
});
