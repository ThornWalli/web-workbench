import { defineMenuItems } from '@web-workbench/core/classes/MenuItem';

export default defineMenuItems(({ core }) => {
  const { windows } = core.modules;
  return [
    {
      title: 'Base64 Converter',
      items: [
        {
          hotKey: 'I',
          keyCode: 73,
          title: 'Info',
          async action() {
            const component = await import('./components/Info.vue').then(
              module => module.default
            );
            windows?.addWindow(
              {
                component,
                componentData: {},
                options: {
                  title: 'Info',
                  prompt: false,
                  scaleX: false,
                  scaleY: false,
                  scrollX: false,
                  scrollY: false
                }
              },
              {
                group: 'workbench13Extras13ToolsBase64Converter'
              }
            );
          }
        }
      ]
    }
  ];
});
