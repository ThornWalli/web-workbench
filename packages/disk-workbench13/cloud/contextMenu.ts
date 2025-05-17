import type Core from '@web-workbench/core/classes/Core';
import { reactive } from 'vue';
import type { Model, ModelConnect, ModelLogin } from './types';
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
      const component = await import('./components/Info.vue').then(
        module => module.default
      );
      core.modules.windows?.addWindow(
        {
          component,
          componentData: { model },
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
          group: 'workbench13Cloud'
        }
      );
    }
  });
}

function loginWith(core: Core, { items, actions }: Model) {
  return new MenuItemInteraction({
    title: 'Login with…',
    async action() {
      const model = reactive<ModelLogin>({});
      const component = await import('./components/Login.vue').then(
        module => module.default
      );
      const window = core.modules.windows?.addWindow(
        {
          component,
          componentData: {
            items,
            model
          },
          options: {
            title: 'Login with',
            prompt: false,
            scaleX: false,
            scaleY: false,
            scrollX: false,
            scrollY: false
          }
        },
        {
          group: 'workbench13Cloud'
        }
      );

      return new Promise<void>(resolve => {
        window?.events.subscribe(async ({ name, value }) => {
          if (name === 'close') {
            if (value) {
              const { email, password, storage } = value as ModelLogin;
              try {
                if (!email || !password) {
                  throw new Error('Email and password are required');
                }
                if (!storage) {
                  throw new Error('Storage is required');
                }
                await actions?.login(email, password, storage);
              } catch (error) {
                debugger;
                alert(error);
              }
            }
            resolve();
          }
        });
      });
    }
  });
}

function connectWith(core: Core, { actions }: Model) {
  return new MenuItemInteraction({
    title: 'Connect with…',
    async action() {
      const model = reactive<ModelConnect>({
        id: undefined,
        url: undefined,
        apiKey: undefined
      });
      const component = await import('./components/Connect.vue').then(
        module => module.default
      );
      const window = core.modules.windows?.addWindow(
        {
          component,
          componentData: {
            model
          },
          options: {
            title: 'Connect with',
            prompt: false,
            scaleX: false,
            scaleY: false,
            scrollX: false,
            scrollY: false
          }
        },
        {
          group: 'workbench13Cloud'
        }
      );

      return new Promise<void>(resolve => {
        window?.events.subscribe(async ({ name, value }) => {
          if (name === 'close') {
            if (value) {
              const { id, url, apiKey } = value as ModelConnect;
              if (!id) {
                throw new Error('ID is required');
              }
              if (!url) {
                throw new Error('URL is required');
              }
              if (!apiKey) {
                throw new Error('API key is required');
              }
              await actions?.connect(id, apiKey, url);
            }
            resolve();
          }
        });
      });
    }
  });
}
