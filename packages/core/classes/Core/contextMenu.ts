import type Core from '.';
import { defineMenuItems, MENU_ITEM_TYPE } from '../MenuItem';

export default defineMenuItems(({ core }: { core: Core }) => {
  const { windows } = core.modules;
  return [
    {
      order: 0,
      title: 'Web-Workbench',
      items: [
        {
          title: 'Settings',
          action() {
            return core.executeCommand('openSettings');
          }
        },
        {
          type: MENU_ITEM_TYPE.SEPARATOR
        },
        {
          hotKey: 'I',
          keyCode: 73,
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
        },
        {
          type: MENU_ITEM_TYPE.SEPARATOR
        },
        {
          title: 'Imprint',
          action() {
            return core.executeCommand('execute "Imprint.md"');
          }
        },
        {
          title: 'Disclaimer',
          action() {
            return core.executeCommand('execute "Disclaimer.md"');
          }
        }
      ]
    }
  ];
});
