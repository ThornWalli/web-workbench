import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { reactive } from 'vue';
import type {
  Entry,
  EntryContent,
  GuestBookItemData,
  Model,
  Options
} from './types';
import type Window from '@web-workbench/core/classes/Window';
import { SYMBOL } from '../types';
import type Core from '@web-workbench/core/classes/Core';
import { formatFilenameDate } from '@web-workbench/core/utils/date';
import { saveStorageItem } from '@web-workbench/core/utils/fileSystem';
import { ipoint } from '@js-basics/vector';
import type CloudDisk from '@web-workbench/core/classes/FileSystem/items/CloudDisk';
import firebase from '@web-workbench/core/services/firebase';

const NEW_ENTRY = 'newEntry';

export default defineFileItems(({ core }) => {
  let optionsWindow: Window | undefined;
  let infoWindow: Window | undefined;
  const entryWindowMap = new Map<string, Window>();

  return [
    {
      meta: [[ITEM_META.SYMBOL, SYMBOL.GUEST_BOOK]],
      id: 'GuestBook.app',
      name: 'Guestbook',
      createdDate: new Date(2025, 5, 17).getTime(),
      editedDate: new Date(2025, 5, 17).getTime(),
      async action() {
        const executionResolve = core.addExecution();

        const introContent = `# Guest Book
Feel free to leave a message, share your thoughts, or just say hello.
Your words mean a lot and help make this space more personal and memorable.
Thanks for stopping by!`;
        const listContent = '## A collection of entries left by our visitors.';

        const STORGAGE = 'CDGUESTBOOK';
        const model = reactive<Model>({
          isLocked: false,
          options: {
            fileItemPath: `${STORGAGE}:data.json`
          },
          entries: [],
          selectedEntries: []
        });

        let fsItem: CloudDisk;
        try {
          fsItem = await getFsItem();
        } catch (error) {
          console.error(error);
          throw new Error(
            'GuestBook file not found. Please setup storage first.'
          );
        }

        model.isLocked = fsItem.isLocked();

        async function getFsItem() {
          const fsItem = (await core.modules.files?.fs.get(
            model.options.fileItemPath
          )) as CloudDisk;
          if (!fsItem) {
            throw new Error('File not found');
          }
          return fsItem;
        }

        async function loadEntries() {
          return (fsItem.data as GuestBookItemData).content;
        }

        async function refreshItems() {
          const executionResolve = core.addExecution();
          const entries = await loadEntries();
          model.entries = entries;
          executionResolve();
        }

        model.actions = {
          close: () => {
            mainWindow.close();
          },
          openInfo: () => openInfo(model),
          setOptions: (options: Partial<Options>) => {
            Object.assign(model.options, options);
          },
          setupStorage: setupStorage(core, model),
          updateStorage: async () => {
            const executionResolve = core.addExecution();
            try {
              const fsItem = await core.modules.files?.fs.get(
                model.options.fileItemPath
              );
              if (fsItem) {
                fsItem.data = {
                  type: 'json',
                  content: model.entries
                };
                await saveStorageItem(fsItem);
                await refreshItems();
                executionResolve();
              }
            } catch (error) {
              executionResolve();
              throw error;
            }
          },
          import: async (file: File) => {
            const executionResolve = core.addExecution();
            try {
              const entries = JSON.parse(await file.text()) as Entry[];
              const fsItem = await core.modules.files?.fs.get(
                model.options.fileItemPath
              );
              if (fsItem) {
                fsItem.data = {
                  type: 'json',
                  content: entries
                };
                await saveStorageItem(fsItem);
                await refreshItems();
              }
              executionResolve();
            } catch (error) {
              executionResolve();
              throw error;
            }
          },
          export: async () => {
            const executionResolve = core.addExecution();
            const FileSaver = await import('file-saver').then(
              module => module.default
            );

            try {
              const blob = new Blob([JSON.stringify(model.entries)], {
                type: 'application/json;charset=utf-8'
              });

              await FileSaver.saveAs(
                blob,
                `${formatFilenameDate(new Date())}_guest_book.json`
              );
              executionResolve();
            } catch (error) {
              executionResolve();
              throw error;
            }
          },
          writeEntry: async () => {
            openForm(model);
          },
          addEntry: async (entry: EntryContent) => {
            const executionResolve = core.addExecution();
            const response = await (
              await firebase.getFunction<
                { entry: EntryContent },
                {
                  entry?: Entry;
                  error?: string;
                  success?: boolean;
                }
              >('guestBookAdd')
            )({
              entry
            });
            const resultEntry = response.data.entry;
            if (response.data.error) {
              executionResolve();
              throw new Error(response.data.error);
            } else if (resultEntry) {
              model.entries.push(resultEntry);
              executionResolve();
              const message = `Thank you for your entry!\nYour message has been successfully submitted and will appear in the guestbook shortly.`;
              await core.executeCommand(`openDialog "${message}"`);
            }

            entryWindowMap.get(NEW_ENTRY)?.close();
          },
          editEntry: async (entryContent: EntryContent, originEntry: Entry) => {
            const entry = model.entries.find(
              entry => entry.id === originEntry.id
            );
            if (!entry) {
              throw new Error('Entry not found');
            }
            entry.author = entryContent.author;
            entry.subject = entryContent.subject;
            entry.message = entryContent.message;
            await model.actions?.updateStorage();
            entryWindowMap.get(originEntry.id)?.close();
          },
          setSelectedEntries: (entries: string[]) => {
            model.selectedEntries = entries;
          },
          publishEntries: (entries: string[], value: boolean) => {
            entries.forEach(entry => {
              model.entries.find(i => i.id === entry)!.published = value;
            });
            model.selectedEntries = [];
          },
          editEntries: async (entries: string[]) => {
            model.entries
              .filter(i => entries.includes(i.id))
              .forEach(entry => {
                openForm(model, entry);
              });
          },
          removeEntries(entries: string[]) {
            model.entries = model.entries.filter(entry => {
              return !entries.includes(entry.id);
            });
            model.selectedEntries = [];
          },
          truncate: async () => {
            if (
              await core.executeCommand(
                'openDialog --confirm "Really empty the guestbook?"'
              )
            ) {
              const executionResolve = core.addExecution();
              model.entries = [];
              model.selectedEntries = [];
              const fsItem = await core.modules.files?.fs.get(
                model.options.fileItemPath
              );
              if (fsItem) {
                fsItem.data = {
                  type: 'json',
                  content: []
                };
                await saveStorageItem(fsItem);
              }
              executionResolve();
            }
          }
        };

        await refreshItems();

        const mainWindow = core.modules.windows!.addWindow(
          {
            layout: {
              size: ipoint(480, 320),
              position: ipoint(0, 0)
            },
            component: await import('./components/GuestBook.vue').then(
              module => module.default
            ),
            componentData: {
              model,
              introContent,
              listContent
              // modelValue: model.value,
              // 'onUpdate:model-value': (value: string) => {
              //   model.value = value;
              // }
            },
            options: {
              title: 'Guestbook',
              scale: true,
              scrollX: false,
              scrollY: true,
              filled: true
            }
          },
          {
            group: 'extras13GuestBook',
            full: true
          }
        );

        mainWindow.awaitClose().then(() => {
          Array.from(entryWindowMap.values()).forEach(entryWindow => {
            entryWindow.close();
          });
          infoWindow?.close();
          optionsWindow?.close();
        });
        executionResolve();
      }
    }
  ];
  async function openInfo(model: Model) {
    if (infoWindow) {
      return infoWindow;
    }
    infoWindow = core.modules.windows!.addWindow(
      {
        component: await import('./components/Info.vue').then(
          async module => module.default
        ),
        componentData: {
          model
        },
        options: {
          title: 'Info'
        }
      },
      {
        group: 'extras13GuestBook'
      }
    );

    infoWindow.awaitClose().then(() => {
      infoWindow = undefined;
    });
    return infoWindow;
  }

  async function openForm(model: Model, originEntry?: Entry) {
    const id = originEntry?.id || NEW_ENTRY;
    if (entryWindowMap.has(id)) {
      return entryWindowMap.get(id);
    }
    const entryWindow = core.modules.windows!.addWindow(
      {
        layout: {
          size: ipoint(480, 320)
        },
        component: await import('./components/Form.vue').then(
          async module => module.default
        ),
        componentData: {
          model,
          originEntry
        },
        options: {
          title: 'Entry',
          scale: true,
          scroll: false
        }
      },
      {
        group: 'extras13GuestBook'
      }
    );

    entryWindow.awaitClose().then(() => {
      entryWindowMap.delete(id);
    });
    entryWindowMap.set(id, entryWindow!);
    return entryWindow;
  }
});

function setupStorage(core: Core, model: Model) {
  return async () => {
    const path = model.options.fileItemPath;
    const exist = await core.executeCommand(`exist "${path}"`);

    const data = window.btoa(
      JSON.stringify({
        type: 'json',
        content: []
      })
    );

    let override = false;
    if (exist) {
      override = await core.executeCommand(
        'openDialog "File exist, overwrite?" --confirm'
      );
    }

    if (!exist || override) {
      const command = [`makefile "${path}"`];

      if (data) {
        command.push(`--data="${data}"`);
      }

      if (override) {
        command.push('--override');
      }

      return core.executeCommand(command.join(' '));
    }
  };
}
