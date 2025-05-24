import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { computed, reactive } from 'vue';
import type { Model } from './types';

export default defineFileItems(({ core }) => {
  const model = reactive<Model>({
    filled: false
  });

  return [
    {
      id: 'Markdown.app',
      async action({ modules }) {
        const component = await import('./components/Markdown.vue').then(
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
              scrollY: true,
              filled: computed(() => model.filled)
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
