import type Core from '@web-workbench/core/classes/Core';
import type { CoreModules } from '@web-workbench/core/classes/Core';

export default function base64Converter(core: Core) {
  return async ({ modules }: { modules: CoreModules }) => {
    const executionResolve = core.addExecution();
    const [component] = await Promise.all([
      import('./components/Base64Converter.vue').then(module => module.default)
    ]);
    modules.windows.addWindow(
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
