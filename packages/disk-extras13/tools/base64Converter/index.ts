import type Core from '@web-workbench/core/classes/Core';
import type { ItemActionCallback } from '@web-workbench/core/classes/FileSystem/types';

export default function base64Converter(core: Core): ItemActionCallback {
  return async ({ modules }) => {
    const executionResolve = core.addExecution();
    const [component] = await Promise.all([
      import('./components/Base64Converter.vue').then(module => module.default)
    ]);
    modules.windows?.addWindow(
      {
        component,
        componentData: {},
        options: {
          title: 'Base64 Converter',
          scaleX: false,
          scaleY: false,
          scrollX: false,
          scrollY: false
        }
      },
      {
        group: 'extras13Base64Converter'
      }
    );
    executionResolve();
  };
}
