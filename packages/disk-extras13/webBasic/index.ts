import { reactive } from 'vue';
import type { Reactive } from 'vue';
import { ipoint } from '@js-basics/vector';
import { WINDOW_POSITION } from '@web-workbench/core/classes/WindowWrapper';
import type Window from '@web-workbench/core/classes/Window';
import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { PROPERTY } from './types';
import type { Model, Value } from './types';
import { getDefaultModel } from './utils';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { SYMBOL } from '../types';
import './types/theme';
import theme from './theme';

export default defineFileItems(({ core }) => {
  let infoWindow: Window | undefined;
  return [
    {
      meta: [
        [ITEM_META.SYMBOL, SYMBOL.WEB_BASIC],
        [ITEM_META.WINDOW_SIZE, ipoint(360, 200)]
      ],
      id: 'WebBasic.app',
      name: 'WebBasic',
      createdDate: new Date(2017, 7, 5).getTime(),
      editedDate: new Date(2020, 3, 14).getTime(),
      async action({ modules }, path?: string) {
        if (!modules.windows) {
          throw new Error('Windows module not found');
        }
        const moduleWindows = modules.windows;

        const executionResolve = core.addExecution();

        let fsItem;
        const model: Reactive<Model> = reactive({
          value: getDefaultModel(),
          fsItem: undefined,
          output: [],
          openValue: undefined
        });
        if (path) {
          fsItem = await modules.files?.fs.get(path);
          if (fsItem && PROPERTY.CONTENT in fsItem.data) {
            const value = {
              ...(fsItem.data as Value),
              [PROPERTY.CONTENT]: ([] as string[])
                .concat((fsItem.data as Value)[PROPERTY.CONTENT])
                .join('\n')
            };
            model.fsItem = fsItem;
            model.value = value;
          } else {
            throw new Error("Can't read file content");
          }
        }
        const [WbComponentsWebBasic, WbComponentsWebBasicPreview] =
          await Promise.all([
            import('./components/WebBasic.vue').then(module => module.default),
            import('./components/Preview.vue').then(module => module.default)
          ]);

        const windowEditor = moduleWindows.addWindow(
          {
            component: WbComponentsWebBasic,
            componentData: {
              model,
              'onUpdate:value': (value: Value) => {
                model.value = value;
              }
            },
            options: {
              title: 'WebBasic - Extras 1.3',
              scaleX: true,
              scaleY: true,
              scrollX: true,
              scrollY: true,
              center: false,
              embed: false,
              borderless: true
            },
            layout: {
              size: ipoint(540, 360)
            }
          },
          {
            group: 'extras13WebBasic'
          }
        );

        let previewWindow: Window;

        model.actions = {
          close: () => {
            windowEditor?.close();
          },
          focus: () => {
            windowEditor?.focus();
          },
          reset: () => {
            model.value = getDefaultModel();
            model.fsItem = undefined;
            model.output = [];
            model.openValue = undefined;
          },
          togglePreview: (toggle = true) => {
            if (toggle) {
              previewWindow = moduleWindows.addWindow(
                {
                  component: WbComponentsWebBasicPreview,
                  componentData: { model },
                  options: {
                    title: 'Preview - WebBasic - Extras 1.3',
                    scaleX: true,
                    scaleY: true,
                    scrollX: true,
                    scrollY: true,
                    center: false,
                    close: false,
                    embed: false,
                    borderless: true
                  },
                  layout: {
                    size: ipoint(540, 360)
                  }
                },
                {
                  group: 'extras13WebBasic',
                  active: false
                }
              );
              window.requestAnimationFrame(() => {
                moduleWindows.contentWrapper.setWindowPositions(
                  WINDOW_POSITION.SPLIT_HORIZONTAL,
                  [windowEditor, previewWindow],
                  { embed: true }
                );
              });
            } else if (previewWindow) {
              windowEditor?.unfocus();
              previewWindow.close();
              window.requestAnimationFrame(() => {
                moduleWindows.contentWrapper.setWindowPositions(
                  WINDOW_POSITION.SPLIT_HORIZONTAL,
                  [windowEditor],
                  { embed: true }
                );
                windowEditor?.focus();
              });
            }
          },
          openInfo: () => openInfo(model)
        };

        core.modules.screen?.setTheme(theme);

        executionResolve();
        windowEditor.awaitClose().then(() => {
          previewWindow?.close();
          infoWindow?.close();
          core.modules.screen?.setTheme(undefined);
        });
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
        group: 'extras13WebBasic'
      }
    );

    infoWindow?.awaitClose().then(() => {
      infoWindow = undefined;
    });
    return infoWindow;
  }
});
