import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { SYMBOL } from '../types';
import { reactive } from 'vue';
import type { Model } from './types';
import type Window from '@web-workbench/core/classes/Window';

export default defineFileItems(({ core }) => {
  let infoWindow: Window | undefined;
  return [
    {
      meta: [[ITEM_META.SYMBOL, SYMBOL.CLOCK]],
      id: 'Clock.app',
      name: 'Clock',
      createdDate: new Date(2017, 7, 5).getTime(),
      editedDate: new Date(2020, 3, 14).getTime(),
      async action() {
        const executionResolve = core.addExecution();

        const model = reactive<Model>({
          actions: {
            openInfo: () => openInfo(model)
          }
        });

        const clockWindow = core.modules.windows?.addWindow(
          {
            component: await import('./components/Clock.vue').then(
              module => module.default
            ),
            componentData: { model },
            options: {
              title: 'Clock'
            }
          },
          {
            group: 'workbench13Clock'
          }
        );
        clockWindow?.awaitClose().then(() => {
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
        component: await import('./components/Info.vue').then(
          module => module.default
        ),
        componentData: { model },
        options: {
          title: 'Info'
        }
      },
      {
        group: 'workbench13Clock'
      }
    );

    infoWindow?.awaitClose().then(() => {
      infoWindow = undefined;
    });
    return infoWindow;
  }
});
