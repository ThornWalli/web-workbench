import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { reactive } from 'vue';
import type Window from '@web-workbench/core/classes/Window';
import { SYMBOL } from '../types';
import type { Model } from './types';
import theme from './theme';

export default defineFileItems(({ core }) => {
  let infoWindow: Window | undefined;
  return [
    {
      meta: [[ITEM_META.SYMBOL, SYMBOL.BOING]],
      id: 'Boing.app',
      name: 'Boing!',
      createdDate: new Date(2025, 8, 2).getTime(),
      editedDate: new Date(2025, 8, 2).getTime(),
      async action({ modules }) {
        const executionResolve = core.addExecution();

        const model = reactive<Model>({
          rendererOptions: {
            pixelSize: 2,
            debugGui: false,
            controls: false
          },
          actions: {
            setControls: (controls: boolean) => {
              model.rendererOptions.controls = controls;
            },
            setPixelSize: (pixelSize: number) => {
              model.rendererOptions.pixelSize = pixelSize;
            },
            close: () => {
              mainWindow.close();
            },
            openInfo: () => openInfo(model)
          }
        });
        core.modules.screen?.setTheme(theme);

        const mainWindow = modules.windows?.addWindow(
          {
            component: await import('./components/windows/Main.vue').then(
              module => module.default
            ),
            componentData: { core, model },
            options: {
              title: 'Boing!',
              embed: true,
              borderless: true,
              absoluteRootHeader: true,
              full: true
            }
          },
          {
            group: 'extras13Boing'
          }
        );

        mainWindow?.awaitClose().then(() => {
          core.modules.screen?.setTheme(undefined);
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
