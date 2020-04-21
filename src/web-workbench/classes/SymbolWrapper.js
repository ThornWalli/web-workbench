import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ipoint, point } from '@js-basics/vector';
import { ITEM_META } from './FileSystem/Item';
import { generateSymbolItems } from './SymbolItem';
import { CONFIG_NAMES as SYMBOLS_CONFIG_NAMES, ORDER_TYPE as SYMBOL_ORDER_TYPE, ORDER_DIRECTION as SYMBOL_ORDER_DIRECTION } from './modules/Symbols/index';
import Event from './Event';
import File from './FileSystem/items/File';
import Directory from './FileSystem/items/Directory';

export default class SymbolWrapper {
  #events = new Subject();
  #id = uuidv4();
  #core;
  items = [];
  selectedItems = [];
  layout = {
    size: ipoint(0, 0),
    position: ipoint(0, 0)
  }

  size = ipoint(0, 0);
  parentSize = ipoint(0, 0);

  constructor (core, items = []) {
    this.#core = core;
    this.items = generateSymbolItems(items);
  }

  get (id) {
    return this.items.find(item => item.id === id);
  }

  has (id) {
    return !!this.items.find(item => item.id === id);
  }

  add (...arg) {
    const items = generateSymbolItems(arg);
    this.items.push(...items);
    // global.setTimeout(() => {
    //   this.rearrangeIcons();
    // });
    this.#events.next(new Event('add', {
      wrapper: this, items
    }));
  }

  remove (item) {
    if (typeof item !== 'object') {
      item = this.get(item);
    }
    this.unselectItem(item.id);
    this.items.splice(this.items.indexOf(item), 1);
    this.#events.next(new Event('remove', {
      wrapper: this, item
    }));
  }

  /**
   * @override
   */
  setup () {
    return Promise.resolve();
  }

  /**
   * @override
   */
  moveItem (id, wrapper) {
    const item = this.get(id);
    wrapper.add(item);
    this.remove(item);
    return Promise.resolve();
  }

  moveItemToItem () {
    return Promise.resolve();
  }

  /**
   * @override
   */
  savePosition (id, position) {
    return Promise.resolve();
  }

  isSelectedItem (id) {
    return this.selectedItems.includes(id);
  }

  selectItem (id) {
    if (!this.isSelectedItem(id)) {
      this.selectedItems.push(id);
      this.#events.next(new Event('selectItem', {
        wrapper: this, id
      }));
    }
  }

  unselectItem (id) {
    if (this.isSelectedItem(id)) {
      this.selectedItems.splice(this.selectedItems.indexOf(id), 1);
      this.#events.next(new Event('unselectItem', {
        wrapper: this, id
      }));
    }
  }

  clearSelectedItems () {
    [].concat(this.selectedItems).forEach(id => this.unselectItem(id));
  }

  get events () {
    return this.#events;
  }

  get id () {
    return this.#id;
  }

  get core () {
    return this.#core;
  }

  rearrangeIcons (options) {
    options = Object.assign({
      orderType: this.#core.config.get(SYMBOLS_CONFIG_NAMES.ORDER_TYPE),
      orderDirection: this.#core.config.get(SYMBOLS_CONFIG_NAMES.ORDER_DIRECTION),
      onlyVisible: !this.#core.config.get(SYMBOLS_CONFIG_NAMES.SHOW_INVISIBLE_SYMBOLS),
      root: false,
      margin: 10
    }, options);
    let items = this.items;

    if (options.onlyVisible) {
      items = items.filter(item => item.model.visible);
    }
    switch (options.orderType) {
      case SYMBOL_ORDER_TYPE.TYPE:
        items = items.sort((a, b) => {
          return a.type.localeCompare(b.type);
        });
        break;
      case SYMBOL_ORDER_TYPE.CREATED_DATE:
        items = items.sort((a, b) => {
          if (a.createDate === b.createDate) {
            return 0;
          } else if (a.createDate > b.createDate) {
            return 1;
          } else {
            return -1;
          }
        });
        break;
      case SYMBOL_ORDER_TYPE.EDITED_DATE:
        items = items.sort((a, b) => {
          if (a.editedDate === b.editedDate) {
            return 0;
          } else if (a.editedDate > b.editedDate) {
            return 1;
          } else {
            return -1;
          }
        });
        break;
      // case ORDER_TYPE.NAME:
      default:
        items = items.sort((a, b) => {
          return a.model.title.localeCompare(a.model.title);
        });
    }
    switch (options.orderDirection) {
      case SYMBOL_ORDER_DIRECTION.ASCENDING:
        items.reverse();
        break;
    }

    const itemMargin = options.margin;
    let x;
    let y = itemMargin;

    const maxSize = point(0, 0);

    if (options.root) {
      x = this.size.x;
    } else {
      x = itemMargin;
    }

    items.forEach((item) => {
      if (options.root) {
        item.layout.position = ipoint(x - item.layout.size.x, y);
        if (item.layout.size.x > maxSize.x) {
          maxSize.x = item.layout.size.x;
        }
        if (y + item.layout.size.y < this.parentSize.y) {
          y += item.layout.size.y + itemMargin;
        } else {
          x -= maxSize.x + itemMargin;
          y = itemMargin;
        }
      } else {
        if (item.layout.size.y > maxSize.y) {
          maxSize.y = item.layout.size.y;
        }
        item.layout.position = ipoint(x, y);
        if (x + item.layout.size.x < this.parentSize.x) {
          x += item.layout.size.x + itemMargin;
        } else {
          x = itemMargin;
          y += maxSize.y + itemMargin;
          item.layout.position = ipoint(x, y);
          x += item.layout.size.x + itemMargin;
        }
      }
    });

    return Promise.all(items.map(({ id, layout }) => this.savePosition(id, layout.position)));
  }
}

export class FileSystemSymbolWrapper extends SymbolWrapper {
  #fsItem;
  usedMemory = 0;

  async setup (fsItem) {
    this.#fsItem = fsItem;
    const items = Array.from((await fsItem.getItems()).values());
    await Promise.all((items).map(async item => this.add(await FileSystemSymbolWrapper.fsItemToSymbol(item))));
    fsItem.events.subscribe(this.onEventItem.bind(this));
  }

  get fsItem () {
    return this.#fsItem;
  }

  async moveItemToItem (from, to) {
    if (from.locked) {
      throw new Error('Items are locked');
    }
    from.meta.set(ITEM_META.POSITION, ipoint(0, 0));
    await this.core.modules.files.fs.saveItem(from);
    await this.core.modules.files.fs.move(from, to, { override: true });
  }

  async moveItem (id, wrapper) {
    const item = this.get(id);
    if (item.fsItem instanceof File || item.fsItem instanceof Directory) {
      try {
        await this.moveItemToItem(item.fsItem, wrapper.fsItem);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
    return Promise.resolve(false);
  }

  savePosition (id, position) {
    const item = this.get(id);
    item.fsItem.meta.set(ITEM_META.POSITION, position);
    this.core.modules.files.fs.saveItem(item.fsItem);
  }

  hasFsItem (fsItem) {
    return this.items.find(item => item.fsItem.id === fsItem.id);
  }

  async onEventItem ({ name, value }) {
    let item;
    switch (name) {
      case 'addItem':
        item = await FileSystemSymbolWrapper.fsItemToSymbol(value);
        if (!this.hasFsItem(value)) {
          this.add(item);
        }
        break;
      case 'removeItem':
        this.remove(this.items.find(item => item.fsItem === value));
        break;
    }
    this.usedMemory = this.#fsItem.size / this.#fsItem.maxSize;
  }

  static getItemsFromItem (item) {
    return Promise.all(Array.from(item.items.values())
      .map(FileSystemSymbolWrapper.fsItemToSymbol));
  }

  static async fsItemToSymbol (item) {
    const path = await item.getPath();

    const data = {

      fsItem: item,
      model: {
        title: item.name
      }
    };

    if (typeof item.action === 'function') {
      data.command = `executeFile "${path}"`;
    }

    if (item.meta.has(ITEM_META.WEB_URL)) {
      data.url = item.meta.get(ITEM_META.WEB_URL);
    }

    return data;
  }
}

