import type { ErrorDescription } from '@web-workbench/core/classes/Core/types';
import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { reactive, markRaw, type Reactive } from 'vue';
import type { Model, ModelConnect, ModelLogin } from './types';
import { SYMBOL } from '../types';
import type Core from '@web-workbench/core/classes/Core';

export default defineFileItems(({ core }) => {
  return [
    {
      meta: [[ITEM_META.SYMBOL, SYMBOL.CLOUD]],
      id: 'Cloud.app',
      name: 'Cloud',
      createdDate: new Date(2017, 7, 5).getTime(),
      editedDate: new Date(2020, 3, 14).getTime(),
      async action({ modules }) {
        const model = reactive<Model>({
          id: null,
          items: []
        });

        async function update() {
          model.items = (await core.executeCommand('cloudList -json')).map(
            markRaw
          );
        }

        function hasError(value: ErrorDescription) {
          if (value instanceof Error) {
            return core.executeCommand(
              `openDialog "${value.message}" --title="${value.code}"`
            );
          }
        }

        async function login(
          email: string,
          password: string,
          storageId: string
        ) {
          await hasError(
            await core.executeCommand(
              `cloudAuth -login --email="${email}" --password="${password}" --storage="${storageId}"`
            )
          );
          return update();
        }

        async function logout(id: string) {
          await hasError(
            await core.executeCommand(`cloudAuth --storage="${id}" -logout `)
          );
          return update();
        }

        async function connect(id: string, apiKey: string, url: string) {
          await hasError(
            await core.executeCommand(
              `cloudMount "CD${id.replace(
                /^(CD|cd)/,
                ''
              )}" --apiKey="${apiKey}" --url="${url}"`
            )
          );
          return update();
        }
        async function disconnect(id: string) {
          await hasError(await core.executeCommand(`cloudUnmount "${id}"`));
          return update();
        }

        const executionResolve = core.addExecution();

        modules.files?.fs.root.events.subscribe(({ name }) => {
          switch (name) {
            case 'addItem':
            case 'removeItem':
              return update();
          }
        });

        model.actions = {
          login,
          logout,
          connect,
          disconnect,
          openInfo: openInfo(core, model),
          openLogin: openLogin(core, model),
          openConnect: openConnect(core, model)
        };

        await update();

        const component = await import('./components/Cloud.vue').then(
          module => module.default
        );

        modules.windows?.addWindow(
          {
            component,
            componentData: { model, setId: (id: string) => (model.id = id) },
            options: {
              title: 'Cloud',
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
        executionResolve();
      }
    }
  ];
});

function openInfo(core: Core, model: Reactive<Model>) {
  return async () => {
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
  };
}

function openLogin(core: Core, model: Reactive<Model>) {
  return async () => {
    const loginModel = reactive<ModelLogin>({});
    const component = await import('./components/Login.vue').then(
      module => module.default
    );
    const window = core.modules.windows?.addWindow(
      {
        component,
        componentData: {
          items: model.items,
          model: loginModel
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
              await model.actions?.login(email, password, storage);
            } catch (error) {
              debugger;
              alert(error);
            }
          }
          resolve();
        }
      });
    });
  };
}

function openConnect(core: Core, model: Reactive<Model>) {
  return async () => {
    const modelConnect = reactive<ModelConnect>({
      id: undefined,
      url: undefined,
      apiKey: undefined,
      actions: model.actions
    });
    const component = await import('./components/Connect.vue').then(
      module => module.default
    );
    const window = core.modules.windows?.addWindow(
      {
        component,
        componentData: {
          model: modelConnect
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
            await model.actions?.connect(id, apiKey, url);
          }
          resolve();
        }
      });
    });
  };
}
