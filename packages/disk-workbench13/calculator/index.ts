import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { SYMBOL } from '../types';
import type Window from '@web-workbench/core/classes/Window';
import { reactive } from 'vue';
import type { Model } from './types';

export default defineFileItems(({ core }) => {
  let infoWindow: Window | undefined;
  return [
    {
      meta: [[ITEM_META.SYMBOL, SYMBOL.CALCULATOR]],
      id: 'Calculator.app',
      name: 'Calculator',
      createdDate: new Date(2017, 7, 5).getTime(),
      editedDate: new Date(2020, 3, 14).getTime(),
      async action() {
        const executionResolve = core.addExecution();

        const model = reactive<Model>({
          actions: {
            openInfo: () => openInfo(model)
          }
        });

        const calculatorWindow = core.modules.windows?.addWindow(
          {
            component: await import('./components/Calculator.vue').then(
              module => module.default
            ),
            componentData: {
              model
            },
            options: {
              title: 'Calculator'
            }
          },
          {
            group: 'workbench13Calculator'
          }
        );

        calculatorWindow?.awaitClose().then(() => {
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
        group: 'workbench13Calculator'
      }
    );

    infoWindow?.awaitClose().then(() => {
      infoWindow = undefined;
    });
    return infoWindow;
  }
});
