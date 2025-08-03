import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { SYMBOL as SYMBOL_CORE } from '@web-workbench/core/utils/symbols';
import { reactive } from 'vue';
import type { Model } from './types';
import type Window from '@web-workbench/core/classes/Window';

export default defineFileItems(({ core }) => {
  let infoWindow: Window | undefined;
  return [
    {
      meta: [[ITEM_META.SYMBOL, SYMBOL_CORE.DEFAULT]],
      id: 'Base64Converter.app',
      name: 'Base64Converter',
      createdDate: new Date(2023, 8, 4).getTime(),
      editedDate: new Date(2023, 8, 4).getTime(),
      async action({ modules }) {
        const executionResolve = core.addExecution();

        const model = reactive<Model>({
          actions: {
            openInfo: () => openInfo(model)
          }
        });

        const converterWindow = modules.windows?.addWindow(
          {
            component: await import('./components/windows/Main.vue').then(
              module => module.default
            ),
            componentData: { model },
            options: {
              title: 'Base64 Converter'
            }
          },
          {
            group: 'extras13ToolsBase64Converter'
          }
        );

        converterWindow?.awaitClose().then(() => {
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
        group: 'extras13ToolsBase64Converter'
      }
    );

    infoWindow?.awaitClose().then(() => {
      infoWindow = undefined;
    });
    return infoWindow;
  }
});
