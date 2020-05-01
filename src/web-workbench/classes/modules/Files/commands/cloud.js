import { Table as ConsoleTable } from '../../../../utils/console';
import { ArgumentInfo } from '../../../Command';
import errorMessage from '../../../../services/errorMessage';
import FirebaseStorage from '../../../Storage/FirebaseStorage';

const storages = new Map();

export default ({ module, core }) => {
  const { fileSystem } = module;
  return [
    {

      name: 'cloudList',
      args: [
        new ArgumentInfo({
          name: 'json',
          flag: true,
          description: 'Get JSON Export'
        })
      ],
      action ({ json }, options) {
        const storageList = Array.from(storages.values());
        if (json) {
          return Promise.resolve(storageList);
        } else {
          const table = new ConsoleTable();
          table.addColumn({
            value: 'Storage (Id)',
            align: 'left',
            minWidth: 15
          });
          table.addColumn({
            value: 'Name',
            align: 'left',
            minWidth: 15
          });
          table.addColumn({
            value: 'Logged In',
            align: 'center',
            minWidth: 9
          });
          table.addRow(
            storageList.reduce((result, item) => {
              result.push([
                item.id, item.name, item.storage.storage.isLogged() ? 'yes' : 'no'
              ]);
              return result;
            }, [])
          );
          options.message([
            table
          ]);
          return Promise.resolve();
        }
      }
    },
    {
      name: 'cloudMount',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'id',
          flag: true,
          description: 'Id from Storage.'
        }),
        new ArgumentInfo({
          index: 1,
          name: 'apiKey',
          description: 'Firebase Api-Key.'
        }),
        new ArgumentInfo({
          index: 2,
          name: 'url',
          description: 'Firebase Database-Url.'
        })
      ],
      async action ({ id, apiKey, url }, options) {
        if (!apiKey || !url) {
          throw errorMessage.get('bad_args');
        }
        console.log({ id, apiKey, url });
        const executionResolve = core.addExecution();
        const storageItem = await fileSystem.connect(FirebaseStorage, { id, apiKey, url });
        storages.set(storageItem.id, storageItem);
        options.message(`Mount <b>${storageItem.name}</b> successful!`);
        executionResolve();
        return storageItem;
      }
    },
    {
      name: 'cloudUnmount',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'id',
          flag: true,
          description: 'Id from Storage.'
        })
      ],
      async action ({ id }, options) {
        if (!id) {
          throw errorMessage.get('bad_args');
        }
        const executionResolve = core.addExecution();
        try {
          const storageItem = storages.get(id);
          await fileSystem.disconnect(storageItem);
          storages.delete(storageItem.id);
          options.message(`Unmount "${storageItem.name}" successful!`);
          executionResolve();
        } catch (error) {
          executionResolve();
          throw new Error(error);
        }
      }
    },
    {
      name: 'cloudAuth',
      args: [
        new ArgumentInfo({
          name: 'login',
          flag: true,
          description: 'Storage Login'
        }),
        new ArgumentInfo({
          name: 'logout',
          flag: true,
          description: 'Logout from Storage.'
        }),
        new ArgumentInfo({
          name: 'email',
          description: 'Email for Login.'
        }),
        new ArgumentInfo({
          name: 'password',
          description: 'Password for Login.'
        }),
        new ArgumentInfo({
          name: 'storage',
          description: 'Specifies which drive is logged on.'
        })
      ],
      // eslint-disable-next-line complexity
      async action ({ email, password, storage, login, logout }, options) {
        const storageId = storage;
        if (!storageId) {
          throw errorMessage.get('bad_args');
        }
        const executionResolve = core.addExecution();
        const selectedStorage = storages.get(storageId);

        let item;
        if (selectedStorage) {
          try {
            if (login) {
              if (!email || !password) {
                throw errorMessage.get('bad_args');
              }
              item = await selectedStorage.storage.storage.login(email, password);
              options.message(`Login with ${selectedStorage.id} (${selectedStorage.id}) successful!`);
            } else if (logout) {
              item = await selectedStorage.storage.storage.logout();
              options.message(`Logout from ${selectedStorage.id} (${selectedStorage.id}) successful!`);
            }
          } catch (error) {
            executionResolve();
            switch (error.code) {
              case 'auth/user-not-found':
              case 'auth/wrong-password':
                return error;
            }
            throw new Error(error);
          }
        } else {
          throw new Error(`${storageId} is not mounted.`);
        }

        executionResolve();
        return item;
      }
    }

  ];
};
