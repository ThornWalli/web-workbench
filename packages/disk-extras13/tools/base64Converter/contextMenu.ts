import { MenuItemInteraction } from '@web-workbench/core/classes/MenuItem';
import { KEYBOARD_CODE } from '@web-workbench/core/services/dom';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';

export default defineMenuItems(({ core }) => {
  const { windows } = core.modules;
  return [
    new MenuItemInteraction({
      title: 'Base64 Converter',
      items: [
        new MenuItemInteraction({
          hotKey: { alt: true, code: KEYBOARD_CODE.KEY_I, title: 'I' },
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
        })
      ]
    })
  ];
});
