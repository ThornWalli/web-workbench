/* eslint-disable complexity */
import { markRaw, reactive, type Reactive } from 'vue';
import { ipoint } from '@js-basics/vector';
import Root from '../../classes/FileSystem/items/Root';
import { pathJoin, formatId } from '../../utils/fileSystem';
import type Item from '../../classes/FileSystem/Item';

import Trashcan from '../../classes/FileSystem/items/Trashcan';
import Storage from '../../classes/FileSystem/items/Storage';
import { FileSystemSymbolWrapper } from '../../classes/SymbolWrapper/FileSystem';
import type Core from '../../classes/Core';
import type SymbolItem from '../../classes/SymbolItem';
import type ItemContainer from '../../classes/FileSystem/ItemContainer';
import type Windows from '../Windows';
import type Symbols from '../Symbols';
import { ITEM_META, type ItemMetaValue } from '../../classes/FileSystem/types';
import { SELECT_TYPE } from '@web-workbench/core/components/modules/files/Open.vue';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import { MenuItemInteraction, MenuItemSeparator } from '../../classes/MenuItem';

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

    itemLink: { disabled: false },
    itemLinkNew: { disabled: false },
    itemLinkEdit: { disabled: false },

    webLink: { disabled: false },
    webLinkNew: { disabled: false },
    webLinkEdit: { disabled: false }
  });
  function setMenuItems() {
    const selectedItems = symbols.getSelectedItems<Item | SymbolItem>() || [];
    const primaryWrapper = symbols.getPrimaryWrapper();

    options.info.disabled = selectedItems.length < 1;
    options.open.disabled = selectedItems.length < 1;
    options.edit.disabled =
      selectedItems.length < 1 ||
      !!(selectedItems as Item[]).find(
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
      !(
        primaryWrapper instanceof FileSystemSymbolWrapper &&
        primaryWrapper.fsItem &&
        (primaryWrapper.fsItem instanceof Root || !primaryWrapper.fsItem.locked)
      ) ||
      !primaryWrapper;

    options.itemLinkEdit.disabled =
      selectedItems.length < 1 ||
      !!(selectedItems as SymbolItem[]).find(
        item => !item?.fsItem?.meta.get(ITEM_META.REFERENCE)
      );
    options.itemLinkNew.disabled = options.container.disabled;
    options.itemLink.disabled =
      options.itemLinkNew.disabled && options.itemLinkEdit.disabled;

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
    new MenuItemInteraction({
      order: 1,
      title: 'File',
      items: [
        new MenuItemInteraction({
          title: 'Open',
          options: options.open,
          action: openAction
        }),
        new MenuItemInteraction({
          title: 'Edit',
          options: options.edit,
          action: editAction
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          title: 'Link',
          options: options.itemLink,
          items: [
            new MenuItemInteraction({
              title: 'New',
              options: options.itemLinkNew,
              action: itemLinkNewAction
            }),
            new MenuItemInteraction({
              title: 'Edit',
              options: options.itemLinkEdit,
              action: itemLinkEditAction
            })
          ]
        }),
        new MenuItemInteraction({
          title: 'Web Link',
          options: options.webLink,
          items: [
            new MenuItemInteraction({
              title: 'New',
              options: options.webLinkNew,
              action: webLinkNewAction
            }),
            new MenuItemInteraction({
              title: 'Edit',
              options: options.webLinkEdit,
              action: webLinkEditAction
            })
          ]
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
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
        }),
        new MenuItemInteraction({
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
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
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
        }),
        new MenuItemInteraction({
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
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          title: 'Info',
          options: options.info,
          async action() {
            const selectedItems = symbols.getSelectedItems() || [];
            await Promise.all(
              selectedItems
                .filter(item => item.fsItem)
                .map(async selectedItem => {
                  if (selectedItem.fsItem) {
                    const component = await import(
                      '../../components/modules/files/Info.vue'
                    ).then(module => module.default);
                    windows.addWindow({
                      component,
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
                })
            );
          }
        })
      ]
    })
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

  async function saveItemLink(
    {
      name,
      path: itemReference,
      symbol
    }: {
      name: string;
      path: string;
      symbol: string;
    },
    fsItem?: Item
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
          `editfilemeta "${path}" "${ITEM_META.REFERENCE}" "${itemReference}"`
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
    fsItem?: Item
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

  async function itemLinkNewAction() {
    const component = await import(
      '../../components/modules/files/ItemLink.vue'
    ).then(module => module.default);
    const window = windows.addWindow({
      component,
      componentData: {
        model: {
          actions: {
            save: saveItemLink,
            selectItem: () => {
              return core.executeCommand(
                `openFileDialog --type=${SELECT_TYPE.BOTH}`
              );
            }
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

  async function itemLinkEditAction() {
    const selectedItems = symbols.getSelectedItems();
    await Promise.all(
      selectedItems
        .filter(item => item.fsItem)
        .map(async selectedItem => {
          const fsItem = selectedItem.fsItem;
          if (fsItem) {
            const component = await import(
              '../../components/modules/files/ItemLink.vue'
            ).then(module => module.default);
            windows.addWindow({
              component,
              componentData: {
                fsItem: markRaw(fsItem),
                model: {
                  actions: {
                    save: saveItemLink,
                    selectItem: () => {
                      return core.executeCommand(
                        `openFileDialog --type=${SELECT_TYPE.BOTH}`
                      );
                    }
                  },
                  name: fsItem.name,
                  path: fsItem.meta.get(ITEM_META.REFERENCE),
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
        })
    );
  }

  async function webLinkNewAction() {
    const component = await import(
      '../../components/modules/files/WebLink.vue'
    ).then(module => module.default);
    const window = windows.addWindow({
      component,
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
        title: 'Make Web Link',
        prompt: false,
        scaleX: false,
        scaleY: false,
        scrollX: false,
        scrollY: false
      }
    });

    return window.awaitClose();
  }

  async function webLinkEditAction() {
    const selectedItems = symbols.getSelectedItems();
    await Promise.all(
      selectedItems
        .filter(item => item.fsItem)
        .map(async selectedItem => {
          const fsItem = selectedItem.fsItem;
          if (fsItem) {
            const component = await import(
              '../../components/modules/files/WebLink.vue'
            ).then(module => module.default);
            windows.addWindow({
              component,
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
                title: 'Edit Web Link',
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
        })
    );
  }

  async function editAction() {
    const selectedItems = symbols.getSelectedItems();
    await Promise.all(
      selectedItems
        .filter(item => item.fsItem)
        .map(async selectedItem => {
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
                    fsItem: Item
                  ) => Promise<Item>;
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
              model[name] = fsItem.meta.has(name)
                ? fsItem.meta.get(name)
                : false;
            });

            const component = await import(
              '../../components/modules/files/Edit.vue'
            ).then(module => module.default);
            windows.addWindow({
              component,
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
        })
    );
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

  async function saveFile(
    options: {
      id: string;
      name?: string;
    } & SaveFileMetaOptions,
    fsItem: Item
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
        item = await core.executeCommand(`rename "${path}" "${name}" -n`);
      } else {
        item = await core.executeCommand(`rename "${path}" "${id}" -rn`);
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

export interface SaveFileMetaOptions {
  [ITEM_META.SYMBOL]?: ItemMetaValue;
  [ITEM_META.VISIBLE]?: ItemMetaValue;
  [ITEM_META.IGNORE_SYMBOL_REARRANGE]?: ItemMetaValue;
  [ITEM_META.WINDOW_SCALE]?: ItemMetaValue;
  [ITEM_META.WINDOW_SCROLL_X]?: ItemMetaValue;
  [ITEM_META.WINDOW_SCROLL_Y]?: ItemMetaValue;
  [ITEM_META.WINDOW_FULL_SIZE]?: ItemMetaValue;
  [ITEM_META.WINDOW_SYMBOL_REARRANGE]?: ItemMetaValue;
  [ITEM_META.WINDOW_SIDEBAR]?: ItemMetaValue;
}
