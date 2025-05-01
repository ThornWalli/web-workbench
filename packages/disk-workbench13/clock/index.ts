import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { SYMBOL } from '@web-workbench/core/utils/symbols';

export default defineFileItems(({ core }) => {
  return [
    {
      meta: [[ITEM_META.SYMBOL, SYMBOL.CLOCK]],
      id: 'Clock.app',
      name: 'Clock',
      createdDate: new Date(2017, 7, 5).getTime(),
      editedDate: new Date(2020, 3, 14).getTime(),
      async action() {
        const executionResolve = core.addExecution();
        const component = await import('./components/Clock.vue').then(
          module => module.default
        );
        core.modules.windows?.addWindow(
          {
            component,
            componentData: {},
            options: {
              title: 'Clock',
              scaleX: false,
              scaleY: false,
              scrollX: false,
              scrollY: false
            }
          },
          {
            group: 'workbench13Clock'
          }
        );
        executionResolve();
      }
    }
  ];
});
