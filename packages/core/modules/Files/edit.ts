import type Item from '../../classes/FileSystem/Item';
import type Core from '../../classes/Core';
import { ITEM_META } from '../../classes/FileSystem/types';
import type { EditModel, SaveFileMetaOptions } from './types';
import type ItemContainer from '../../classes/FileSystem/ItemContainer';
import { markRaw, reactive } from 'vue';
import type { Reactive } from 'vue';
import type Window from '../../classes/Window';
import { ipoint } from '@js-basics/vector';
import { wrapString } from '@web-workbench/core/utils/helper';

export async function openItemEdit(
  core: Core,
  fsItems?: (Item | ItemContainer)[]
) {
  const editItemWindows: Window[] = [];
  let itemMetaWindow: Window | undefined;
  const symbolsModule = core.modules.symbols!;
  const windowsModule = core.modules.windows!;

  const selectedItems: (Item | ItemContainer)[] =
    fsItems ||
    symbolsModule
      .getSelectedItems()
      .filter(item => {
        if (item.fsItem) {
          return item.fsItem;
        } else {
          throw new Error(`Item has no fsItem. ${item.id}`);
        }
      })
      .map(item => item.fsItem!);

  await Promise.all(
    selectedItems.map(async fsItem => {
      const model: Reactive<EditModel> = reactive({
        actions: {
          openItemMeta: () => openItemMeta(model),
          save: (fsItem, model) => saveFile(core, fsItem, model),
          saveItemMeta: (fsItem, options, force) =>
            saveFileMeta(core, fsItem, options, force)
        },
        id: fsItem.id,
        name: fsItem.name,
        fsItem
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

      const editWindow = windowsModule.addWindow({
        component: await import('../../components/modules/files/Edit.vue').then(
          module => module.default
        ),
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

      editWindow.awaitClose().then(() => {
        editItemWindows.splice(editItemWindows.indexOf(editWindow), 1);
      });

      editItemWindows.push(editWindow);
    })
  );

  async function openItemMeta(model: Reactive<EditModel>) {
    const fsItem = model.fsItem;
    itemMetaWindow = windowsModule.addWindow(
      {
        component: await import(
          '../../components/modules/files/edit/ItemMeta.vue'
        ).then(module => module.default),
        componentData: {
          fsItem: markRaw(fsItem),
          model
        },
        options: {
          title: `Item Meta ${fsItem.name}`,
          scale: true,
          scrollY: true
        },
        layout: {
          size: ipoint(420, 360)
        }
      },
      {
        full: true
      }
    );
    return itemMetaWindow!.awaitClose().then(() => {
      // Refresh the item after closing the meta window
      itemMetaWindow = undefined;
    });
  }
}

export async function saveFile(
  core: Core,
  fsItem: Item,
  options: {
    id: string;
    name?: string;
  } & SaveFileMetaOptions
) {
  const { id, name } = options;
  const path = fsItem.getPath();

  if (!id) {
    throw new Error('Id is emoty!');
  }

  let item;
  const executionResolve = core.addExecution();

  try {
    await saveFileMeta(core, fsItem, options);

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

function getSaveFileMetaOptionList(): (keyof SaveFileMetaOptions)[] {
  return Object.values(ITEM_META) as (keyof SaveFileMetaOptions)[];
}

async function saveFileMeta(
  core: Core,
  fsItem: Item | ItemContainer,
  options: SaveFileMetaOptions,
  force: boolean = false
) {
  const executionResolve = core.addExecution();
  await core.executeCommand(
    `cleanfilemeta "${fsItem.getPath()}" ${force ? '--force' : ''}`
  );
  const items = getSaveFileMetaOptionList().filter(
    name => options[name] !== undefined
  );

  await items.reduce(
    (result, name) =>
      result.then(async () => {
        let value = options[name];
        let json = false;
        if (typeof value === 'string') {
          value = `"${value}"`;
        } else if (typeof value === 'object') {
          json = true;
          value = wrapString(encodeURIComponent(JSON.stringify(value)));
        }

        await core.executeCommand(
          `editfilemeta "${fsItem.getPath()}" "${name}" ${value} ${json ? '--json' : ''}`
        );
      }),
    Promise.resolve()
  );
  executionResolve();
}
