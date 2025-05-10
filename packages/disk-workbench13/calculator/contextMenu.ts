import { defineMenuItems } from '@web-workbench/core/classes/MenuItem';

export default defineMenuItems(({ core }) => {
  return [
    {
      title: 'Calculator',
      items: [
        {
          hotKey: { alt: true, code: 'KeyI', title: 'I' },
          title: 'Info',
          async action() {
            const component = await import('./components/Info.vue').then(
              module => module.default
            );
            core.modules.windows?.addWindow(
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
                group: 'workbench13Calculator'
              }
            );
          }
        }
      ]
    }
  ];
});
