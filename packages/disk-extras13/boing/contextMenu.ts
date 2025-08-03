import {
  MenuItemInteraction,
  MenuItemSeparator
} from '@web-workbench/core/classes/MenuItem';
import type { WindowMenuItems } from '@web-workbench/core/types/contextMenu';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import type { Model } from './types';
import { KEYBOARD_CODE } from '@web-workbench/core/types/dom';

export default defineMenuItems<{ model: Model } & WindowMenuItems>(
  ({ model }) => {
    const menuItems = [];

    menuItems.push(
      new MenuItemInteraction({
        title: 'Boing',
        items: [
          new MenuItemInteraction({
            hotKey: {
              alt: true,
              code: KEYBOARD_CODE.KEY_I,
              title: 'I'
            },
            title: 'Info',
            async action() {
              return model.actions?.openInfo();
            }
          }),
          new MenuItemSeparator(),
          new MenuItemInteraction({
            title: 'Close',
            action() {
              return model.actions?.close();
            }
          })
        ]
      })
    );

    return menuItems;
  }
);
