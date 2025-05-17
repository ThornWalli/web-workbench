import type { ErrorDescription } from '@web-workbench/core/classes/Core/types';
import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { reactive, markRaw } from 'vue';
import type { Model } from './types';
import { SYMBOL } from '../types';

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
          if (value) {
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
          disconnect
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
