import type Core from '@web-workbench/core/classes/Core';
import type { CoreModules } from '@web-workbench/core/classes/Core';

export default function clock(core: Core) {
  return async ({ modules }: { modules: CoreModules }) => {
    const executionResolve = core.addExecution();
    const [component] = await Promise.all([
      import('./components/Clock.vue').then(module => module.default)
    ]);
    modules.windows.addWindow(
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
  };
}
