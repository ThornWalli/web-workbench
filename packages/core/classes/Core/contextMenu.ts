import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import type Core from '.';
import { MenuItemSeparator, MenuItemInteraction } from '../MenuItem';

export default defineMenuItems(({ core }: { core: Core }) => {
  const { windows } = core.modules;
  return [
    new MenuItemInteraction({
      order: 0,
      title: 'Web-Workbench',
      items: [
        new MenuItemInteraction({
          title: 'Settings',
          action() {
            return core.executeCommand('openSettings');
          }
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          hotKey: { alt: true, code: 'KeyI', title: 'I' },
          title: 'Info',
          async action() {
            const component = await import(
              '@web-workbench/core/components/modules/core/Info.vue'
            ).then(module => module.default);
            windows?.addWindow({
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
            });
          }
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          title: 'Imprint',
          action() {
            return core.executeCommand('execute "Imprint.md"');
          }
        }),
        new MenuItemInteraction({
          title: 'Disclaimer',
          action() {
            return core.executeCommand('execute "Disclaimer.md"');
          }
        })
      ]
    })
  ];
});
