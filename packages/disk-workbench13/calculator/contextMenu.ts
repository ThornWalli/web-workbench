import { MenuItemInteraction } from '@web-workbench/core/classes/MenuItem';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';

export default defineMenuItems(({ core }) => {
  return [
    new MenuItemInteraction({
      title: 'Calculator',
      items: [
        new MenuItemInteraction({
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
        })
      ]
    })
  ];
});
