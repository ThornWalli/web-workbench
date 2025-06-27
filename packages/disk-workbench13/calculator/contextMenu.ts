import { MenuItemInteraction } from '@web-workbench/core/classes/MenuItem';
import { KEYBOARD_CODE } from '@web-workbench/core/types/dom';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import type { Model } from './types';

export default defineMenuItems<{ model: Model }>(({ model }) => {
  return [
    new MenuItemInteraction({
      title: 'Calculator',
      items: [
        new MenuItemInteraction({
          hotKey: { alt: true, code: KEYBOARD_CODE.KEY_I, title: 'I' },
          title: 'Info',
          async action() {
            return model.actions.openInfo();
          }
        })
      ]
    })
  ];
});
