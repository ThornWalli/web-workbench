import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { reactive } from 'vue';
import type { Model } from './types';

export default defineFileItems(({ core }) => {
  const model = reactive<Model>({
    showSelected: false,
    showSymbolUsed: false
  });

  return [
    {
      id: 'Symbols.app',
      async action({ modules }) {
        const component = await import('./components/Symbols.vue').then(
          module => module.default
        );
        modules.windows?.addWindow(
          {
            component,
            componentData: { core, model },
            options: {
              title: 'Symbols',
              scaleX: true,
              scaleY: true,
              scrollX: false,
              scrollY: true
            }
          },
          {
            full: true
          }
        );
      }
    }
  ];
});
