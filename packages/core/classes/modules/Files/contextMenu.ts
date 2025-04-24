/* eslint-disable complexity */
import { markRaw, reactive, type Reactive } from 'vue';
import { ipoint } from '@js-basics/vector';
import Root from '../../FileSystem/items/Root';
import { pathJoin, formatId } from '../../../utils/fileSystem';
import type FsItem from '../../FileSystem/Item';
import { ITEM_META, type ItemMetaValue } from '../../FileSystem/Item';
import Trashcan from '../../FileSystem/items/Trashcan';
import Storage from '../../FileSystem/items/Storage';
import { defineMenuItems, MENU_ITEM_TYPE } from '../../MenuItem';
import type Core from '../../Core';
import WbModuleFilesEdit from '../../../components/modules/files/Edit.vue';
import WbModuleFilesWebLink from '../../../components/modules/files/WebLink.vue';
import WbModuleFilesInfo from '../../../components/modules/files/Info.vue';
import { FileSystemSymbolWrapper } from '../../SymbolWrapper/FileSystem';
import type SymbolItem from '../../SymbolItem';
import type ItemContainer from '../../FileSystem/ItemContainer';
import type Windows from '../Windows';
import type Symbols from '../Symbols';

export default defineMenuItems(({ core }: { core: Core }) => {
  const symbols = (core.modules.symbols || {}) as Symbols;
  const windows = (core.modules.windows || {}) as Windows;

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
  function setMenuItems() {
    const selectedItems = symbols.getSelectedItems<FsItem | SymbolItem>() || [];
    const primaryWrapper = symbols.getPrimaryWrapper();

    options.info.disabled = selectedItems.length < 1;
    options.open.disabled = selectedItems.length < 1;
    options.edit.disabled =
      selectedItems.length < 1 ||
      !!(selectedItems as FsItem[]).find(
        fsItem => fsItem?.locked || fsItem instanceof Trashcan
      );

    options.duplicate.disabled =
      selectedItems.length < 1 ||
      !!(selectedItems as SymbolItem[]).find(
        ({ fsItem }) =>
          fsItem?.locked ||
          fsItem instanceof Trashcan ||
          fsItem instanceof Storage
      );
    options.container.disabled =
      !options.open.disabled ||
      (primaryWrapper instanceof FileSystemSymbolWrapper &&
        primaryWrapper.fsItem &&
        (primaryWrapper.fsItem instanceof Root ||
          primaryWrapper.fsItem.locked)) ||
      !primaryWrapper;

    options.webLinkEdit.disabled =
      selectedItems.length < 1 ||
      !!(selectedItems as SymbolItem[]).find(
        item => !item?.fsItem?.meta.get(ITEM_META.WEB_URL)
      );
    options.webLinkNew.disabled = options.container.disabled;
    options.webLink.disabled =
      options.webLinkNew.disabled && options.webLinkEdit.disabled;

    options.emptyTrashcan.disabled =
      selectedItems.length < 1 ||
      !!(selectedItems as SymbolItem[]).find(
        item => !(item?.fsItem instanceof Trashcan)
      );
    options.discard.disabled =
      selectedItems.length < 1 ||
      !!(selectedItems as SymbolItem[]).find(
        ({ fsItem }) =>
          fsItem?.locked ||
          fsItem instanceof Trashcan ||
          fsItem instanceof Storage
      );
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
          type: MENU_ITEM_TYPE.SEPARATOR
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
          type: MENU_ITEM_TYPE.SEPARATOR
        },
        {
          title: 'Duplicate',
          options: options.duplicate,
          action() {
            const selectedItems = symbols.getSelectedItems() || [];
            return Promise.all(
              selectedItems
                .filter(item => item.fsItem)
                .map(async ({ fsItem }) => {
                  const path = await fsItem?.getPath();
                  return core.executeCommand(
                    `copy "${path}" "${path}" -ignore`
                  );
                })
            );
          }
        },
        {
          title: 'Make Dir',
          options: options.container,
          async action() {
            const item =
              symbols.getPrimaryWrapper<FileSystemSymbolWrapper>()?.fsItem;
            if (item) {
              const path = pathJoin(await item.getPath(), 'Directory');
              console.log(`makedir "${path}" -ignore`);
              return core.executeCommand(`makedir "${path}" -ignore`);
            } else {
              throw new Error('No item found');
            }
          }
        },
        {
          type: MENU_ITEM_TYPE.SEPARATOR
        },
        {
          title: 'Discard',
          options: options.discard,
          action() {
            const selectedItems = symbols.getSelectedItems() || [];
            return Promise.all(
              selectedItems
                .filter(item => item.fsItem)
                .map(async ({ fsItem }) => {
                  const path = await fsItem?.getPath();
                  return core.executeCommand(`remove "${path}" -r`);
                })
            );
          }
        },
        {
          title: 'Empty Trashcan',
          options: options.emptyTrashcan,
          action() {
            const selectedItems = symbols.getSelectedItems() || [];
            return Promise.all(
              selectedItems
                .filter(item => item.fsItem)
                .map(async ({ fsItem }) => {
                  const items =
                    (await (fsItem as ItemContainer)?.getItems()) || [];
                  return Promise.all(
                    Array.from(items.values()).map(async fsItem => {
                      // return fsItem.remove({ recursive: true });
                      const path = await fsItem.getPath();
                      return core.executeCommand(`remove "${path}" -r -ignore`);
                    })
                  );
                })
            );
          }
        },
        {
          type: MENU_ITEM_TYPE.SEPARATOR
        },
        {
          title: 'Info',
          options: options.info,
          action() {
            const selectedItems = symbols.getSelectedItems() || [];
            selectedItems
              .filter(item => item.fsItem)
              .forEach(selectedItem => {
                if (selectedItem.fsItem) {
                  windows.addWindow({
                    component: WbModuleFilesInfo,
                    componentData: {
                      fsItem: markRaw(selectedItem.fsItem)
                    },
                    layout: {
                      size: ipoint(460, 280)
                    },
                    options: {
                      title: `Info File ${selectedItem.fsItem.name}`,
                      scaleX: true,
                      scaleY: true,
                      prompt: false,
                      scrollX: true,
                      scrollY: true
                    }
                  });
                } else {
                  throw new Error(`Item has no fsItem. ${selectedItem.id}`);
                }
              });
          }
        }
      ]
    }
  ];
  function openAction() {
    const selectedItems = symbols.getSelectedItems() || [];
    selectedItems
      .filter(item => item.fsItem)
      .forEach(selectedItem => {
        if (selectedItem.command) {
          const executeOptions = {
            showCommand: false,
            show: true
          };
          return core.executeCommand(selectedItem.command, executeOptions);
        }
      });
  }

  async function saveWebLink(
    {
      name,
      url,
      symbol
    }: {
      name: string;
      url: string;
      symbol: string;
    },
    fsItem?: FsItem
  ) {
    if (!fsItem) {
      fsItem = await core.executeCommand(
        `saveFileDialog --id="${formatId(name)}"`
      );
    }
    if (fsItem) {
      const executionResolve = core.addExecution();
      try {
        const path = fsItem.getPath();
        await core.executeCommand(`rename "${path}" "${name}" -n`);
        await core.executeCommand(
          `editfilemeta "${path}" "${ITEM_META.WEB_URL}" "${url}"`
        );
        await core.executeCommand(
          `editfilemeta "${path}" "${ITEM_META.SYMBOL}" "${symbol}"`
        );
      } catch (error) {
        executionResolve();
        throw error;
      }
      executionResolve();
      return true;
    }
    return false;
  }

  function webLinkNewAction() {
    const window = windows.addWindow({
      component: WbModuleFilesWebLink,
      componentData: {
        model: {
          actions: {
            save: saveWebLink
          },
          name: null,
          url: null,
          symbol: 'default'
        }
      },
      options: {
        title: 'Make Link',
        prompt: false,
        scaleX: false,
        scaleY: false,
        scrollX: false,
        scrollY: false
      }
    });

    return window.awaitClose();
  }

  function webLinkEditAction() {
    const selectedItems = symbols.getSelectedItems();
    selectedItems
      .filter(item => item.fsItem)
      .forEach(selectedItem => {
        const fsItem = selectedItem.fsItem;
        if (fsItem) {
          windows.addWindow({
            component: WbModuleFilesWebLink,
            componentData: {
              fsItem: markRaw(fsItem),
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
              title: 'Edit Link',
              prompt: false,
              scaleX: false,
              scaleY: false,
              scrollX: false,
              scrollY: false
            }
          });
        } else {
          throw new Error(`Item has no fsItem. ${selectedItem.id}`);
        }
      });
  }

  function editAction() {
    const selectedItems = symbols.getSelectedItems();
    selectedItems
      .filter(item => item.fsItem)
      .forEach(selectedItem => {
        const fsItem = selectedItem.fsItem;

        if (fsItem) {
          const model: Reactive<
            {
              actions: {
                save: (
                  options: {
                    id: string;
                    name?: string;
                  } & SaveFileMetaOptions,
                  fsItem: FsItem
                ) => Promise<FsItem>;
              };
              id: string;
              name?: string;
            } & SaveFileMetaOptions
          > = reactive({
            actions: {
              save: saveFile
            },
            id: fsItem.id,
            name: fsItem.name
          });

          (
            [
              ITEM_META.SYMBOL,
              ITEM_META.VISIBLE,
              ITEM_META.IGNORE_SYMBOL_REARRANGE,
              ITEM_META.WINDOW_SCALE,
              ITEM_META.WINDOW_SCROLL_X,
              ITEM_META.WINDOW_SCROLL_Y,
              ITEM_META.WINDOW_FULL_SIZE,
              ITEM_META.WINDOW_SYMBOL_REARRANGE,
              ITEM_META.WINDOW_SIDEBAR
            ] as (keyof SaveFileMetaOptions)[]
          ).forEach(name => {
            model[name] = fsItem.meta.has(name) ? fsItem.meta.get(name) : false;
          });

          windows.addWindow({
            component: WbModuleFilesEdit,
            componentData: {
              fsItem: markRaw(fsItem),
              model
            },
            options: {
              title: `Edit File ${fsItem.name}`,
              prompt: false,
              scaleX: false,
              scaleY: false,
              scrollX: false,
              scrollY: false
            }
          });
        } else {
          throw new Error(`Item has no fsItem. ${selectedItem.id}`);
        }
      });
  }

  function getSaveFileMetaOptionList(): (keyof SaveFileMetaOptions)[] {
    return [
      ITEM_META.SYMBOL,
      ITEM_META.VISIBLE,
      ITEM_META.IGNORE_SYMBOL_REARRANGE,
      ITEM_META.WINDOW_SCALE,
      ITEM_META.WINDOW_SCROLL_X,
      ITEM_META.WINDOW_SCROLL_Y,
      ITEM_META.WINDOW_FULL_SIZE,
      ITEM_META.WINDOW_SYMBOL_REARRANGE,
      ITEM_META.WINDOW_SIDEBAR
    ];
  }

  type SaveFileMetaOptions = {
    [ITEM_META.SYMBOL]?: ItemMetaValue;
    [ITEM_META.VISIBLE]?: ItemMetaValue;
    [ITEM_META.IGNORE_SYMBOL_REARRANGE]?: ItemMetaValue;
    [ITEM_META.WINDOW_SCALE]?: ItemMetaValue;
    [ITEM_META.WINDOW_SCROLL_X]?: ItemMetaValue;
    [ITEM_META.WINDOW_SCROLL_Y]?: ItemMetaValue;
    [ITEM_META.WINDOW_FULL_SIZE]?: ItemMetaValue;
    [ITEM_META.WINDOW_SYMBOL_REARRANGE]?: ItemMetaValue;
    [ITEM_META.WINDOW_SIDEBAR]?: ItemMetaValue;
  };

  async function saveFile(
    options: {
      id: string;
      name?: string;
    } & SaveFileMetaOptions,
    fsItem: FsItem
  ) {
    const { id, name } = options;
    const path = fsItem.getPath();

    if (!id) {
      throw new Error('Id is emoty!');
    }

    let item;
    const executionResolve = core.addExecution();

    try {
      await Promise.all(
        getSaveFileMetaOptionList().map(name => {
          let value = options[name];
          if (typeof value === 'string') {
            value = `"${value}"`;
          }
          return core.executeCommand(
            `editfilemeta "${path}" "${name}" ${value}`
          );
        })
      );

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
      throw error;
    }

    executionResolve();

    return item;
  }
});
