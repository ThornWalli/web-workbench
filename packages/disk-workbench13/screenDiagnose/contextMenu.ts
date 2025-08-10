import {
  MenuItemInteraction,
  MenuItemSeparator
} from '@web-workbench/core/classes/MenuItem';
import { KEYBOARD_CODE } from '@web-workbench/core/types/dom';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import type { Model } from './types';

export default defineMenuItems<{ model: Model }>(({ model }) => {
  return [
    new MenuItemInteraction({
      title: 'Screen Diagnose',
      items: [
        new MenuItemInteraction({
          hotKey: { alt: true, code: KEYBOARD_CODE.KEY_I, title: 'I' },
          title: 'Info',
          async action() {
            return model.actions.openInfo();
          }
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          hotKey: { ctrl: true, code: KEYBOARD_CODE.KEY_Q, title: 'Q' },
          title: 'Close',
          async action() {
            return model.actions.close();
          }
        })
      ]
    })
  ];
});
