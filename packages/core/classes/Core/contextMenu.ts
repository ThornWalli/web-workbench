import type Core from '.';
import WbModuleCoreInfo from '../../components/modules/core/Info.vue';
import { defineMenuItems, MENU_ITEM_TYPE } from '../MenuItem';

export default defineMenuItems<{ core: Core }>(({ core }) => {
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
          action() {
            windows?.addWindow({
              title: 'Info',
              component: WbModuleCoreInfo,
              componentData: {},
              options: {
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
