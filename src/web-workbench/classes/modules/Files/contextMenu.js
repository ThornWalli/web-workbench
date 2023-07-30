
import { filter } from 'rxjs/operators';
import { markRaw, reactive } from 'vue';
import Root from '../../FileSystem/items/Root';
import WbModuleFilesEdit from '../../../../components/modules/files/Edit';
import WbModuleFilesWebLink from '../../../../components/modules/files/WebLink';
import WbModuleFilesInfo from '../../../../components/modules/files/Info';
import { pathJoin, formatId } from '../../../../web-workbench/utils/fileSystem';
import { ITEM_META } from '../../FileSystem/Item';
import Trashcan from '../../FileSystem/items/Trashcan';
import Storage from '../../FileSystem/items/Storage';
export default ({ core }) => {
  const { windows, symbols } = core.modules;

  const options = reactive({
    open: { disabled: false },
    edit: { disabled: false },
    duplicate: { disabled: false },
    container: { disabled: false },
    emptyTrashcan: { disabled: false },
    discard: { disabled: false },
    info: { disabled: false },

    webLink: { disabled: false },

    webLinkNew: { disabled: false },
    webLinkEdit: { disabled: false }
  });

  // eslint-disable-next-line complexity
  function setMenuItems () {
    const selectedItems = symbols.getSelectedItems();
    const primaryWrapper = symbols.getPrimaryWrapper();

    options.info.disabled = selectedItems.length < 1;
    options.open.disabled = selectedItems.length < 1;
    options.edit.disabled = selectedItems.length < 1 || selectedItems.find(fsItem => fsItem.locked || fsItem instanceof Trashcan);

    options.duplicate.disabled = selectedItems.length < 1 || selectedItems.find(({ fsItem }) => (fsItem.locked || fsItem instanceof Trashcan || fsItem instanceof Storage));
    options.container.disabled = !options.open.disabled || (primaryWrapper && primaryWrapper.fsItem && (primaryWrapper.fsItem instanceof Root || primaryWrapper.fsItem.locked)) || !primaryWrapper;

    options.webLinkEdit.disabled = selectedItems.length < 1 || selectedItems.find(item => !item.fsItem.meta.get(ITEM_META.WEB_URL));
    options.webLinkNew.disabled = options.container.disabled;
    options.webLink.disabled = options.webLinkNew.disabled && options.webLinkEdit.disabled;

    options.emptyTrashcan.disabled = selectedItems.length < 1 || selectedItems.find(item => !(item.fsItem instanceof Trashcan));
    options.discard.disabled = selectedItems.length < 1 || selectedItems.find(({ fsItem }) => (fsItem.locked || fsItem instanceof Trashcan || fsItem instanceof Storage));
  }

  symbols.events.subscribe(() => setMenuItems());
  setMenuItems();

  return [
    {
      order: 1,
      title: 'File',
      items: [
        {
          title: 'Open',
          options: options.open,
          action: openAction
        },
        {
          title: 'Edit',
          options: options.edit,
          action: editAction
        },
        {
          separator: true
        },
        {
          title: 'Web Link',
          options: options.webLink,
          items: [
            {
              title: 'New',
              options: options.webLinkNew,
              action: webLinkNewAction

            },
            {
              title: 'Edit',
              options: options.webLinkEdit,
              action: webLinkEditAction
            }

          ]
        },
        {
          separator: true
        },
        {
          title: 'Duplicate',
          options: options.duplicate,
          action () {
            const selectedItems = symbols.getSelectedItems();
            return Promise.all(selectedItems.filter(item => item.fsItem).map(async ({ fsItem }) => {
              const path = await fsItem.getPath();
              return core.executeCommand(`copy "${path}" "${path}" -ignore`);
            }));
          }
        },
        {
          title: 'Make Dir',
          options: options.container,
          async action () {
            const item = symbols.getPrimaryWrapper().fsItem;
            const path = pathJoin(await item.getPath(), 'Directory');
            console.log(`makedir "${path}" -ignore`);
            return core.executeCommand(`makedir "${path}" -ignore`);
          }
        },
        {
          separator: true
        },
        {
          title: 'Discard',
          options: options.discard,
          action () {
            const selectedItems = symbols.getSelectedItems();
            return Promise.all(selectedItems.filter(item => item.fsItem).map(async ({ fsItem }) => {
              const path = await fsItem.getPath();
              return core.executeCommand(`remove "${path}" -r`);
            }));
          }
        },
        {
          title: 'Empty Trashcan',
          options: options.emptyTrashcan,
          action () {
            const selectedItems = symbols.getSelectedItems();
            return Promise.all(selectedItems.filter(item => item.fsItem).map(async ({ fsItem }) => {
              return Promise.all(Array.from((await fsItem.getItems()).values()).map(async (fsItem) => {
                // return fsItem.remove({ recursive: true });
                const path = await fsItem.getPath();
                return core.executeCommand(`remove "${path}" -r -ignore`);
              }));
            }));
          }
        },
        {
          separator: true
        },
        {
          title: 'Info',
          options: options.info,
          action () {
            const selectedItems = symbols.getSelectedItems();
            selectedItems.filter(item => item.fsItem).forEach((selectedItem) => {
              windows.addWindow({
                title: `Info File ${selectedItem.fsItem.name}`,
                component: WbModuleFilesInfo,
                componentData: {
                  fsItem: markRaw(selectedItem.fsItem)
                },
                options: {
                  scale: true,
                  prompt: false,
                  scrollX: false,
                  scrollY: true
                }
              });
            });
          }
        }
      ]
    }
  ];
  function openAction () {
    const selectedItems = symbols.getSelectedItems();
    selectedItems.filter(item => item.fsItem).forEach((selectedItem) => {
      if (selectedItem.command) {
        const executeOptions = {
          showCommand: false,
          show: true
        };
        return core
          .executeCommand(selectedItem.command, executeOptions);
      }
    });
  }

  async function saveWebLink ({ name, url, symbol }, fsItem) {
    if (!fsItem) {
      fsItem = await core.executeCommand(`saveFileDialog --id="${formatId(name)}"`);
    }
    if (fsItem) {
      const executionResolve = core.addExecution();
      try {
        const path = fsItem.getPath();
        await core.executeCommand(`rename "${path}" "${name}" -n`);
        await core.executeCommand(`editfilemeta "${path}" "${ITEM_META.WEB_URL}" "${url}"`);
        await core.executeCommand(`editfilemeta "${path}" "${ITEM_META.SYMBOL}" "${symbol}"`);
      } catch (error) {
        executionResolve();
        throw new Error(error);
      }
      executionResolve();
      return true;
    }
    return false;
  }

  function webLinkNewAction () {
    const window = windows.addWindow({
      title: 'Make Link',
      component: WbModuleFilesWebLink,
      componentData: {
        model: {
          actions: {
            save: saveWebLink
          },
          name: null,
          url: null,
          symbol: null
        }
      },
      options: {
        scale: false,
        prompt: false,
        scrollX: false,
        scrollY: false
      }
    });
    return new Promise((resolve) => {
      window.events.pipe(filter(({ name }) => name === 'close')).subscribe(resolve);
    });
  }

  function webLinkEditAction () {
    const selectedItems = symbols.getSelectedItems();
    selectedItems.filter(item => item.fsItem).forEach((selectedItem) => {
      const fsItem = selectedItem.fsItem;
      windows.addWindow({
        title: 'Edit Link',
        component: WbModuleFilesWebLink,
        componentData: {
          fsItem,
          model: {
            actions: {
              save: saveWebLink
            },
            name: fsItem.name,
            url: fsItem.meta.get(ITEM_META.WEB_URL),
            symbol: fsItem.meta.get(ITEM_META.SYMBOL)
          }
        },
        options: {
          scale: false,
          prompt: false,
          scrollX: false,
          scrollY: false
        }
      });
    });
  }

  function editAction () {
    const selectedItems = symbols.getSelectedItems();
    selectedItems.filter(item => item.fsItem).forEach((selectedItem) => {
      const fsItem = selectedItem.fsItem;

      const model = reactive({
        actions: {
          save: saveFile
        },
        id: fsItem.id,
        name: fsItem.name
      });

      [
        ITEM_META.SYMBOL,
        ITEM_META.VISIBLE,
        ITEM_META.IGNORE_SYMBOL_REARRANGE,
        ITEM_META.WINDOW_SCALE,
        ITEM_META.WINDOW_SCROLL_X,
        ITEM_META.WINDOW_SCROLL_Y,
        ITEM_META.WINDOW_FULL_SIZE,
        ITEM_META.WINDOW_SYMBOL_REARRANGE
      ].forEach((name) => {
        model[String(name)] = fsItem.meta.has(name) ? fsItem.meta.get(name) : false;
      });

      windows.addWindow({
        title: `Edit File ${fsItem.name}`,
        component: WbModuleFilesEdit,
        componentData: {
          fsItem: markRaw(fsItem),
          model
        },
        options: {
          scale: false,
          prompt: false,
          scrollX: false,
          scrollY: false
        }
      });
    });
  }

  async function saveFile (options, fsItem) {
    const { id, name } = options;
    const path = fsItem.getPath();

    if (!id) {
      throw new Error('Id is emoty!');
    }

    let item;
    const executionResolve = core.addExecution();

    try {
      await Promise.all([
        ITEM_META.SYMBOL,
        ITEM_META.VISIBLE,
        ITEM_META.IGNORE_SYMBOL_REARRANGE,
        ITEM_META.WINDOW_SCALE,
        ITEM_META.WINDOW_SCROLL_X,
        ITEM_META.WINDOW_SCROLL_Y,
        ITEM_META.WINDOW_FULL_SIZE,
        ITEM_META.WINDOW_SYMBOL_REARRANGE
      ].map((name) => {
        let value = options[String(name)];
        if (typeof value === 'string') {
          value = `"${value}"`;
        }
        return core.executeCommand(`editfilemeta "${path}" "${name}" ${value}`);
      }));

      // await core.executeCommand(`editfilemeta "${path}" "${ITEM_META.SYMBOL}" "${symbol}"`);
      // await core.executeCommand(`editfilemeta "${path}" "${ITEM_META.VISIBLE}" "${visible}"`);

      if (name && id !== name) {
        await core.executeCommand(`rename "${path}" "${name}" -n`);
      } else {
        item = core.executeCommand(`rename "${path}" "${id}" -rn`);
      }

      item = core.executeCommand(`rename "${path}" "${id}"`);
    } catch (error) {
      executionResolve();
      throw new Error(error);
    }

    executionResolve();

    return item;
  }
};
