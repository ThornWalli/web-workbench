import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { SYMBOL } from '@web-workbench/core/utils/symbols';

export default defineFileItems(({ core }) => {
  return [
    {
      meta: [[ITEM_META.SYMBOL, SYMBOL.CALCULATOR]],
      id: 'Calculator.app',
      name: 'Calculator',
      createdDate: new Date(2017, 7, 5).getTime(),
      editedDate: new Date(2020, 3, 14).getTime(),
      async action() {
        const component = await import('./components/Calculator.vue').then(
          module => module.default
        );
        const executionResolve = core.addExecution();
        core.modules.windows?.addWindow(
          {
            component,
            componentData: {},
            options: {
              title: 'Calculator',
              scaleX: false,
              scaleY: false,
              scrollX: false,
              scrollY: false
            }
          },
          {
            group: 'workbench13Calculator'
          }
        );
        executionResolve();
      }
    }
  ];
});
