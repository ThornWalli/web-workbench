export default function calculato(core) {
  return async ({ modules }) => {
    const executionResolve = core.addExecution();
    const [component] = await Promise.all([
      import('./components/Calculator').then(module => module.default)
    ]);
    modules.windows.addWindow(
      {
        title: 'Calculator',
        component,
        componentData: {},
        options: {
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
  };
}
