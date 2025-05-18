import type Core from '@web-workbench/core/classes/Core';
import type { Model } from './types';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import {
  MenuItemInteraction,
  MenuItemSeparator
} from '@web-workbench/core/classes/MenuItem';
import type { MenuItemOptions } from '@web-workbench/core/classes/MenuItem/types';

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
      code: 'KeyI',
      title: 'I'
    },
    title: 'Info',
    async action() {
      model.actions?.openInfo();
    }
  });
}

function loginWith(core: Core, model: Model) {
  return new MenuItemInteraction({
    title: 'Login with…',
    async action() {
      model.actions?.openLogin();
    }
  });
}

function connectWith(core: Core, model: Model) {
  return new MenuItemInteraction({
    title: 'Connect with…',
    async action() {
      model.actions?.openConnect();
    }
  });
}
