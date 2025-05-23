import { ASymbolWrapper } from '.';
import File from '../FileSystem/items/File';
import Directory from '../FileSystem/items/Directory';
import { ipoint } from '@js-basics/vector';
import SymbolItem from '../SymbolItem';

import { ITEM_META } from '../FileSystem/types';
import type ItemContainer from '../FileSystem/ItemContainer';
import type { IPoint } from '@js-basics/vector';
import type Item from '../FileSystem/Item';
import type { ItemEvent } from '../FileSystem/Item';

export class FileSystemSymbolWrapper extends ASymbolWrapper {
  fsItem?: ItemContainer;
  usedMemory = 0;

  override async setup(fsItem: ItemContainer) {
    this.fsItem = fsItem;
    const items = Array.from((await fsItem.getItems()).values());
    await Promise.all(
      items.map(async item =>
        this.add(await FileSystemSymbolWrapper.fsItemToSymbol(item))
      )
    );
    fsItem.events.subscribe(this.onEventItem.bind(this));
  }

  override async moveItemToItem(from: Directory | File, to: Directory | File) {
    if (from.locked) {
      throw new Error('Items are locked!');
    }
    if (to.locked) {
      throw new Error('Destination is locked!');
    }
    from.meta.set(ITEM_META.POSITION, ipoint(0, 0));
    await this.core.modules.files?.fs.saveItem(from);
    await this.core.modules.files?.fs.move(from as Item, to as Item, {
      override: true
    });
  }

  override async moveItem(id: string, wrapper: SymbolItem) {
    const item = this.get(id);
    if (
      item &&
      (item.fsItem instanceof File || item.fsItem instanceof Directory)
    ) {
      try {
        if (item?.fsItem && wrapper?.fsItem) {
          await this.moveItemToItem(item.fsItem, wrapper.fsItem);
        } else {
          throw new Error('Item or wrapper not found');
        }
        return true;
      } catch (error) {
        console.warn(error);
        return false;
      }
    }
    return false;
  }

  override async savePosition(id: string | SymbolItem, position: IPoint) {
    let item: SymbolItem | undefined;
    if (typeof id === 'string' && this.get(id)) {
      item = this.get(id);
    } else if (id instanceof SymbolItem) {
      item = id as SymbolItem;
    }

    if (!item) {
      throw new Error(`Item not found. ${id}`);
    } else if (!item.fsItem) {
      throw new Error(`Item has no fsItem. ${id}`);
    } else {
      item.fsItem.meta.set(ITEM_META.POSITION, position);
      this.core.modules.files?.fs.saveItem(item.fsItem);
    }
  }

  hasFsItem(fsItem: Item) {
    return this.items.value.find(item => item.fsItem?.id === fsItem.id);
  }

  async onEventItem({ name, value }: ItemEvent) {
    if (value?.item) {
      let item;
      if (name === 'addItem') {
        item = await FileSystemSymbolWrapper.fsItemToSymbol(value.item);
        if (!this.hasFsItem(value.item)) {
          this.add(item);
        }
      } else if (name === 'removeItem') {
        const selectedItem = this.items.value.find(
          item => item.fsItem?.id === value.item?.id
        );
        if (selectedItem) {
          this.remove(selectedItem);
        } else {
          throw new Error(
            `Item not found in symbol wrapper. ${value.item?.id}`
          );
        }
      }
      this.usedMemory = this.fsItem?.getUsedMemory() || 0;
    } else {
      console.warn('Item event without value', name, value);
    }
  }

  static getItemsFromItem(item: ItemContainer) {
    return Promise.all(
      Array.from(item.items.values()).map(
        FileSystemSymbolWrapper.fsItemToSymbol
      )
    );
  }

  static async fsItemToSymbol(item: Item | ItemContainer) {
    const path = await item.getPath();

    const data = new SymbolItem({
      fsItem: item,
      model: {
        title: item.name || 'Untitled'
      }
    });

    if (typeof item.action === 'function') {
      data.command = `executeFile "${path}"`;
    }

    if (item.meta.get(ITEM_META.WEB_URL)) {
      data.model.url = String(item.meta.get(ITEM_META.WEB_URL));
    }

    return data;
  }
}
