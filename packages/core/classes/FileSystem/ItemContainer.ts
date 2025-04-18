import errorMessage from '../../services/errorMessage';
import * as utils from '../../utils/fileSystem';
import * as helper from '../../utils/helper';
import Event from '../Event';
import Item, {
  type ExportResult,
  type ItemOptions,
  type ItemRemoveInfo,
  type ItemStaticOptions
} from './Item';
import { getClass } from './index';

export interface ItemContainerOptions extends ItemOptions {
  items?: Map<string, Item>;
  maxSize?: number;
}

export default class ItemContainer extends Item {
  #items: Map<string, Item> = new Map();
  #maxSize = utils.kilobyteToByte(1);

  constructor(options: ItemContainerOptions, staticOptions: ItemStaticOptions) {
    options = { ...options };
    super(options, staticOptions);

    this.addItems(options.items || this.#items);
    this.#maxSize = options.maxSize || this.#maxSize;
  }

  override async export(options: { encodeData?: boolean } = {}) {
    const data: {
      items: ExportResult[];
    } & ExportResult = {
      ...(await super.export(options)),
      // ...await super.export(options),
      items: []
    };

    // delete data.data;
    Reflect.deleteProperty(data, 'data');

    data.items = await Promise.all(
      Array.from(this.#items.values()).map(item => item.export())
    );
    return data;
  }

  async addItems(items: Map<string, Item> | ExportResult[], override = false) {
    let preparedItems: (Item | ExportResult)[] = [];
    if (items instanceof Map) {
      preparedItems = Array.from(items.values());
    } else if (Array.isArray(items)) {
      preparedItems = items;
    }

    preparedItems = preparedItems.map(item => {
      if (typeof item.data === 'string') {
        item.data = helper.atob(item.data);
      }
      return item;
    });
    const parsedItems = this.parseItems(preparedItems);

    return Promise.all(parsedItems.map(item => this.addItem(item, override)));
  }

  static normalizeItemData(data: ExportResult | Item): ExportResult {
    const normalizedData: {
      items?: Map<string, Item>;
    } & ExportResult = { ...data };

    const normalizeList = [];
    if ('items' in data && !(data.items instanceof Map)) {
      normalizedData.items = new Map(
        (data.items as Item[]).map(item => [item.id, item])
      );
    }
    // TODO: kann das weg?
    if ('info' in data && data.info) {
      //   data.meta = [data.info, null];
      //   delete data.info;
      //   normalizeList.push('info');
      debugger;
    }
    if ('extension' in normalizedData) {
      normalizedData.id += '.' + normalizedData.extension;
      delete normalizedData.extension;
      normalizeList.push('extension');
    }
    if ('createTime' in normalizedData) {
      normalizedData.createdDate = normalizedData.createTime as number;
      delete normalizedData.createTime;
      normalizeList.push('createTime');
    }
    if ('editTime' in normalizedData) {
      normalizedData.editedDate = normalizedData.editTime as number;
      delete normalizedData.editTime;
      normalizeList.push('editTime');
    }
    if ('icon' in normalizedData) {
      delete normalizedData.icon;
      normalizeList.push('icon');
    }
    if (normalizeList.length) {
      console.warn(
        '@deprecated TODO: muss weg, hier werden die alten Items angepasst.',
        normalizedData,
        normalizeList
      );
    }

    return normalizedData;
  }

  parseItems(items: (Item | ExportResult)[]): Item[] {
    return items.map(itemData => {
      const normlizedData = ItemContainer.normalizeItemData(itemData);

      let ItemClass;
      if (normlizedData.type) {
        ItemClass = getClass(normlizedData.type);
      } else if ('items' in normlizedData) {
        ItemClass = getClass('Directory');
      } else {
        ItemClass = getClass();
      }

      return new ItemClass(normlizedData);
    });
  }

  async addItem(item: Item, ignore = false) {
    const lastParent = item.parent;

    console.log('addItem', item.id);

    if (!ignore && this.hasItem(item.id)) {
      throw new Error(`File ${item.id} exists`);
    }

    if (lastParent) {
      await lastParent.removeItem(item);
    }

    if (ignore) {
      const ext = utils.getExt(item.id);
      const cleanId = utils.removeExt(item.id);
      item.setId(utils.addExt(utils.getNextItemId(cleanId, this, ext), ext));
    }

    this.#items.set(item.id, item);
    item.setParent(this);
    item.events.next(new Event({ name: 'move', value: { item, lastParent } }));
    this.events.next(new Event({ name: 'addItem', value: item }));

    return item;
  }

  removeItem(item: Item) {
    // this.events.unsubscribe()
    item.setParent(undefined);
    this.#items.delete(item.id);
    this.events.next(new Event({ name: 'removeItem', value: item }));
    return Promise.resolve();
  }

  /**
   * Remove Item.
   * @param  {boolean} recursive When sets, removes all items from itemWrapper.
   */
  override async remove(options: { recursive?: boolean } = {}) {
    const { recursive } = {
      recursive: false,
      ...options
    };
    const removedItems: ItemRemoveInfo[] = [];
    if (recursive) {
      // get items recursive
      const items = await this.getItems();
      for (const item of items.values()) {
        removedItems.push(...(await item.remove(options)));
      }
      removedItems.push(...(await super.remove(options)));

      return removedItems;
    } else {
      const items = await this.getItems();
      if (items.size > 0) {
        throw new Error(
          errorMessage
            .get('FileSystemItem_itemContainerNotEmpty', await this.getPath())
            ?.join(' ')
        );
      } else {
        return await super.remove(options);
      }
    }
  }

  changeItemId(item: Item, lastId: string, id: string) {
    this.#items.delete(lastId);
    this.#items.set(id, item);
    if (this.parent) {
      console.log('changeItemId by parent', lastId, id, this.parent.items);
    }
  }

  getItems() {
    return Promise.resolve(this.#items);
  }

  getItem(id: string) {
    return this.#items.get(id);
  }

  hasItem(id: string) {
    return this.#items.has(id);
  }

  get items() {
    return this.#items;
  }

  override get size() {
    return Array.from(this.#items.values()).reduce(function (result, item) {
      if (!(item instanceof ItemContainer)) {
        result += item.size;
      }
      return result;
    }, 0);
  }

  override get maxSize(): number {
    return getMaxSizeFromParent(this);
    function getMaxSizeFromParent(item: Item) {
      if (item.parent && item.getRealMaxSize()) {
        return getMaxSizeFromParent(item.parent);
      } else {
        return item.getRealMaxSize();
      }
    }
  }
}

errorMessage.add([
  [
    'FileSystemItem_itemContainerNotEmpty',
    ['ItemWrapp Not Empty', 'ItemContainer not empty… %1']
  ]
]);
