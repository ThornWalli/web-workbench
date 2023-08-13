export default function clock(core) {
  return async ({ modules }) => {
    const executionResolve = core.addExecution();
    const [component] = await Promise.all([
      import('./components/Clock').then(module => module.default)
    ]);
    modules.windows.addWindow(
      {
        title: 'Clock',
        component,
        componentData: {},
        options: {
          scale: false,
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
