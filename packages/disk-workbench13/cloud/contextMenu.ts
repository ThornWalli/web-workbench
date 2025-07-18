import type Core from '@web-workbench/core/classes/Core';
import type { Model } from './types';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import {
  MenuItemInteraction,
  MenuItemSeparator
} from '@web-workbench/core/classes/MenuItem';
import type { MenuItemOptions } from '@web-workbench/core/classes/MenuItem/types';
import { KEYBOARD_CODE } from '@web-workbench/core/types/dom';

export default defineMenuItems<{ model: Model }>(({ core, model }) => {
  return [
    new MenuItemInteraction({
      title: 'Cloud',
      items: [
        connectWith(core, model),
        loginWith(core, model),
        new MenuItemSeparator(),
        info(core, model)
      ]
    })
  ];
});

function info(core: Core, model: Model): MenuItemOptions {
  return new MenuItemInteraction({
    hotKey: {
      alt: true,
      code: KEYBOARD_CODE.KEY_I,
      title: 'I'
    },
    title: 'Info',
    action() {
      return model.actions?.openInfo();
    }
  });
}

function loginWith(core: Core, model: Model) {
  return new MenuItemInteraction({
    title: 'Login with…',
    action() {
      return model.actions?.openLogin();
    }
  });
}

function connectWith(core: Core, model: Model) {
  return new MenuItemInteraction({
    title: 'Connect with…',
    action() {
      return model.actions?.openConnect();
    }
  });
}
