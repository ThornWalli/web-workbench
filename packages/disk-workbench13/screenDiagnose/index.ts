import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { reactive } from 'vue';
import type { Model } from './types';
import type Window from '@web-workbench/core/classes/Window';
import { SYMBOL } from '../types';

export default defineFileItems(({ core }) => {
  let mainWindow: Window | undefined;
  let infoWindow: Window | undefined;
  return [
    {
      meta: [[ITEM_META.SYMBOL, SYMBOL.SCREEN_DIAGNOSE]],
      id: 'ScreenDiagnose.app',
      name: 'Screen Diagnose',
      createdDate: new Date(2025, 8, 10).getTime(),
      editedDate: new Date(2025, 8, 10).getTime(),
      async action() {
        const executionResolve = core.addExecution();

        const model = reactive<Model>({
          actions: {
            close: () => {
              mainWindow?.close();
            },
            openInfo: () => openInfo(model)
          }
        });

        mainWindow = core.modules.windows?.addWindow(
          {
            component: await import('./components/windows/Main.vue').then(
              module => module.default
            ),
            componentData: { model },
            options: {
              title: 'Screen Diagnose',
              full: true,
              hideRootHeader: true,
              absoluteRootHeader: true,
              embed: true,
              borderless: true
            }
          },
          {
            group: 'workbench13ScreenDiagnose'
          }
        );
        mainWindow?.awaitClose().then(() => {
          infoWindow?.close();
        });
        executionResolve();
      }
    }
  ];
  async function openInfo(model: Model) {
    if (infoWindow) {
      return infoWindow;
    }
    infoWindow = core.modules.windows?.addWindow(
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
        group: 'workbench13DisplayTest'
      }
    );

    infoWindow?.awaitClose().then(() => {
      infoWindow = undefined;
    });
    return infoWindow;
  }
});
