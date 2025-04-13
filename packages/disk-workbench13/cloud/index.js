import { reactive, markRaw } from 'vue';

export default function cloud(core) {
  return async ({ modules }) => {
    async function updateItems(model) {
      model.items = (await core.executeCommand('cloudList -json')).map(markRaw);
    }

    function hasError(value) {
      if (value instanceof Error) {
        return core.executeCommand(
          `openDialog "${value.message}" --title="${value.code}"`
        );
      }
    }

    const model = reactive({ actions: {}, id: null, items: [] });
    model.actions.login = async (email, password, storageId) => {
      await hasError(
        await core.executeCommand(
          `cloudAuth -login --email="${email}" --password="${password}" --storage="${storageId}"`
        )
      );
      return updateItems(model);
    };
    model.actions.logout = async id => {
      await hasError(
        await core.executeCommand(`cloudAuth --storage="${id}" -logout `)
      );
      return updateItems(model);
    };
    model.actions.connect = async (id, apiKey, url) => {
      await hasError(
        await core.executeCommand(
          `cloudMount "CD${id.replace(
            /^(CD|cd)/,
            ''
          )}" --apiKey="${apiKey}" --url="${url}"`
        )
      );
      return updateItems(model);
    };
    model.actions.disconnect = async id => {
      await hasError(await core.executeCommand(`cloudUnmount "${id}"`));
      return updateItems(model);
    };

    const executionResolve = core.addExecution();

    modules.files.fs.root.events.subscribe(({ name }) => {
      switch (name) {
        case 'addItem':
        case 'removeItem':
          return updateItems(model);
      }
    });
    await updateItems(model);

    const [component] = await Promise.all([
      import('./components/Cloud').then(module => module.default)
    ]);

    modules.windows.addWindow(
      {
        title: 'Cloud',
        component,
        componentData: { model, setId: id => (model.id = id) },
        options: {
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
  };
}
