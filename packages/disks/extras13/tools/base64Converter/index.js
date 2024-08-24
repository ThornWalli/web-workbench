export default function base64Converter(core) {
  return async ({ modules }) => {
    const executionResolve = core.addExecution();
    const [component] = await Promise.all([
      import('./components/Base64Converter').then(module => module.default)
    ]);
    modules.windows.addWindow(
      {
        title: 'Base64 Converter',
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
        group: 'extras13Base64Converter'
      }
    );
    executionResolve();
  };
}
