import { reactive } from 'vue';
import { ipoint } from '@js-basics/vector';

import App from './lib/App';
import Bounds from './lib/Bounds';
import { CONFIG_NAMES, type Model } from './types';
import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { SYMBOL } from '@web-workbench/core/utils/symbols';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';

export default defineFileItems(({ core }) => {
  return [
    {
      meta: [[ITEM_META.SYMBOL, SYMBOL.WEB_PAINTING]],
      id: 'WebPainting.app',
      name: 'WebPainting',
      createdDate: new Date(2017, 7, 5).getTime(),
      editedDate: new Date(2020, 3, 14).getTime(),
      async action() {
        const executionResolve = core.addExecution();
        const component = await import('./components/WebPainting.vue').then(
          module => module.default
        );

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

        const window = core.modules.windows?.addWindow(
          {
            component,
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
          close: () => {
            window?.close();
          },
          focus: () => {
            window?.focus();
          }
        };

        executionResolve();
      }
    }
  ];
});
