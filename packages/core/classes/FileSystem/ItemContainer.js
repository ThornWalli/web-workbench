import errorMessage from '../../services/errorMessage';
import * as utils from '../../utils/fileSystem';
import * as helper from '../../utils/helper';
import Event from '../Event';
import Item from './Item';
import { getClass } from './index';

export default class ItemContainer extends Item {
  #items = new Map();
  #maxSize = utils.kilobyteToByte(1);

  constructor(options) {
    options = Object.assign({}, options);
    super(options);
    this.addItems(options.items || this.#items);
    this.#maxSize = options.maxSize || this.#maxSize;
  }

  async export(...args) {
    const data = await Item.prototype.export.apply(this, ...args);
    delete data.data;
    data.items = await Promise.all(
      Array.from(this.#items.values()).map(item => item.export())
    );
    return data;
  }

  async addItems(items, override = false) {
    if (items instanceof Map) {
      items = Array.from(items.values());
    }
    items = items.map(item => {
      if (typeof item.data === 'string') {
        item.data = helper.atob(item.data);
      }
      return item;
    });
    items = this.parseItems(items);

    return Promise.all(items.map(item => this.addItem(item, override)));
  }

  static normalizeItemData(data) {
    const normalizeList = [];
    if ('items' in data && !(data.items instanceof Map)) {
      data.items = new Map(data.items.map(item => [item.id, item]));
    }
    if ('info' in data) {
      data.meta = [data.info];
      delete data.info;
      normalizeList.push('info');
    }
    if ('extension' in data) {
      data.id += '.' + data.extension;
      delete data.extension;
      normalizeList.push('extension');
    }
    if ('createTime' in data) {
      data.createdDate = data.createTime;
      delete data.createTime;
      normalizeList.push('createTime');
    }
    if ('editTime' in data) {
      data.editedDate = data.editTime;
      delete data.editTime;
      normalizeList.push('editTime');
    }
    if ('icon' in data) {
      delete data.icon;
      normalizeList.push('icon');
    }
    if (normalizeList.length) {
      console.warn(
        '@deprecated TODO: muss weg, hier werden die alten Items angepasst.',
        data,
        normalizeList
      );
    }

    return data;
  }

  parseItems(items) {
    return items.map(itemData => {
      itemData = ItemContainer.normalizeItemData(itemData);

      let ItemClass;
      if (itemData.type) {
        ItemClass = getClass(itemData.type);
      } else if (itemData.items) {
        ItemClass = getClass('Directory');
      } else {
        ItemClass = getClass();
      }

      return new ItemClass(itemData);
    });
  }

  async addItem(item, ignore = false) {
    const lastParent = item.parent;

    if (!ignore && this.hasItem(item.id)) {
      throw new Error(`File ${item.id} exists`);
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
    item.events.next(new Event('move', { item, lastParent }));
    this.events.next(new Event('addItem', item));

    return item;
  }

  removeItem(item) {
    // this.events.unsubscribe()
    item.setParent(null);
    this.#items.delete(item.id);
    this.events.next(new Event('removeItem', item));
    return Promise.resolve();
  }

  /**
   * Remove Item.
   * @param  {boolean} recursive When sets, removes all items from itemWrapper.
   */
  async remove(options) {
    const { recursive } = Object.assign(
      {
        recursive: false
      },
      options
    );
    if (recursive) {
      // get items recursive
      let items = await this.getItems();
      items = await Promise.all(
        Array.from(items.values()).map(item => item.remove(options))
      );
      items = items.reduce((result, item) => result.concat(item), []);
      items.push(await Item.prototype.remove.apply(this, [options]));
      return items;
    } else {
      const items = await this.getItems();
      if (items.size > 0) {
        throw new Error(
          errorMessage.get(
            'FileSystemItem_itemContainerNotEmpty',
            await this.getPath()
          )
        );
      } else {
        return [await Item.prototype.remove.apply(this, arguments)];
      }
    }
  }

  changeItemId(item, lastId, id) {
    this.#items.delete(lastId);
    this.#items.set(id, item);
    if (this.parent) {
      console.log('changeItemId by parent', lastId, id, this.parent.items);
    }
  }

  getItems() {
    return Promise.resolve(this.#items);
  }

  getItem(id) {
    return this.#items.get(id);
  }

  hasItem(id) {
    return this.#items.has(id);
  }

  get items() {
    return this.#items;
  }

  get size() {
    return Array.from(this.#items.values()).reduce(function (result, item) {
      if (!(item instanceof ItemContainer)) {
        result += item.size;
      }
      return result;
    }, 0);
  }

  get maxSize() {
    return getMaxSizeFromParent(this);
    function getMaxSizeFromParent(item) {
      if (item.parent && item.#maxSize) {
        return getMaxSizeFromParent(item.parent);
      } else {
        return item.#maxSize;
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
