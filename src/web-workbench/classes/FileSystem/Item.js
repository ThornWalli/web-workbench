import { Subject } from 'rxjs';
import { IPoint } from '@js-basics/vector';

import errorMessage from '../../services/errorMessage';
import { getExt, ROOT_ID, formatId, PATH_SEPARATOR } from '../../utils/fileSystem';
import { SYMBOL } from '../../utils/symbols';
import Event from '../Event';
import { btoa } from '@/web-workbench/utils/helper';

// import Blob from 'cross-blob';
let Blob = global.Blob;
if (!Blob) {
  Blob = require('cross-blob');
}

export const ITEM_META = {
  SYMBOL: 'symbol',
  SORT_SYMBOLS: 'sort_symbols',
  VISIBLE: 'visible',
  POSITION: 'position',
  WINDOW_SIZE: 'window_size',
  WEB_URL: 'web_url',
  IGNORE_REARRANGE: 'ignore_rearrange'
};

export const EXT_SYMBOLS = {
  basic: SYMBOL.DISK_BASIC,
  bas: SYMBOL.DISK_BASIC,
  markdown: SYMBOL.DISK_MARKDOWN,
  md: SYMBOL.DISK_MARKDOWN
};

function getSymbolByExt (name) {
  const ext = getExt(name).toLowerCase();
  return EXT_SYMBOLS[String(ext)] || SYMBOL.NOTE_BLANK;
}

export default class Item {
  #events;
  #locked = false;
  #parent = null;

  #createdDate;
  #editedDate;

  #id;
  #name;

  // #meta = new Map();
  #meta;

  #data;
  #action;

  // eslint-disable-next-line complexity
  constructor ({
    locked = false,
    id = null,
    name = null,
    meta = [],
    data = null,
    action = null,
    createdDate = Date.now(),
    editedDate = null
  }) {
    this.#events = new Subject();
    this.#createdDate = createdDate;
    this.#editedDate = editedDate || createdDate;
    this.#locked = locked;
    this.#id = id;
    this.#name = name;

    this.#meta = new Map([
      [
        ITEM_META.SYMBOL, getSymbolByExt(id || '')
      ], [
        ITEM_META.VISIBLE, true
      ]
    ].concat(meta || []));

    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (err) {
        console.log(data);
        throw new Error(err);
      }
    }

    this.#action = action;
    this.data = data || { };
  }

  async remove (options) {
    const { silent } = Object.assign({
      silent: false
    }, options);
    let info;
    const locked = this.isLocked();
    if (!locked) {
      info = {
        type: this.constructor.NAME,
        id: this.id,
        name: this.name,
        path: await this.getPath(),
        size: this.size,
        storage: this.getStorageItem()
      };
    } else if (!silent) {
      return errorMessage.get('FileSystemItem_itemLocked', await this.getPath());
    }

    if (silent || !locked) {
      this.events.next(new Event('remove', this));
      this.events.unsubscribe();
      this.parent.removeItem(this);
    }
    return info;
  }

  isLocked (ignore) {
    if (ignore) {
      return false;
    }
    if (this.parent && (this.parent.locked && this.parent.id !== ROOT_ID)) {
      return true;
    }
    return this.#locked;
  }

  getStorageItem () {
    if ('storage' in this) {
      return this;
    } else if (this.parent) {
      return this.parent.getStorageItem();
    }
    return null;
  }

  async copy () {
    const Class = this.constructor;
    let item = await this.export({
      encodeData: false
    });
    item = new Class(item);
    return Promise.resolve(item);
  }

  rename (id, options) {
    const { name = false, ignore = false } = Object.assign({ name: false, ignore: false }, options);
    if (!this.isLocked(ignore)) {
      if (name) {
        this.name = id;
        return this;
      } else {
        const lastId = this.id;
        this.#id = formatId(id);
        if (this.parent && lastId !== this.id) {
          this.parent.changeItemId(this, lastId, this.id);
        }
      }
      this.events.next(new Event('rename', { name, id }));
    }
    return this;
  }

  save () {
    this.events.next(new Event('save', this));
  }

  get type () {
    return this.constructor.NAME;
  }

  async export (options) {
    const { encodeData } = Object.assign({ encodeData: true }, options);

    const meta = new Map(this.#meta);
    Array.from(meta.keys()).forEach((key) => {
      if (meta.get(key) instanceof IPoint) {
        meta.set(key, meta.get(key).toJSON());
      }
    });
    return {
      type: this.type,
      id: this.#id,
      name: this.#name,
      createdDate: this.#createdDate,
      editedDate: this.#editedDate,
      data: encodeData ? await btoa(this.#data) : this.#data,
      meta: Array.from(meta)
    };
  }

  get createdDate () {
    return this.#createdDate;
  }

  get editedDate () {
    return this.#editedDate;
  }

  get data () {
    if (typeof this.#data === 'string') {
      try {
        return JSON.parse(this.#data);
      } catch (err) {
        return { data: this.#data };
      }
    }
    return this.#data;
  }

  set data (value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    this.#data = value;
  }

  get action () {
    return this.#action;
  }

  get events () {
    return this.#events;
  }

  get parent () {
    return this.#parent;
  }

  setId (id) {
    this.#id = id;
  }

  setParent (parent) {
    this.#parent = parent;
  }

  get locked () {
    if (this.#parent) {
      return this.#parent.locked;
    }
    return this.#locked;
  }

  get id () {
    return this.#id;
  }

  get name () {
    return this.#name || this.#id;
  }

  set name (value) {
    this.#name = value;
  }

  get extension () {
    return getExt(this.#id);
  }

  get meta () {
    return this.#meta;
  }

  get size () {
    return new Blob([
      Object.values(this.data)
    ]).size;
  }

  get maxSize () {
    return new Blob([
      Object.values(this.data)
    ]).size;
  }

  getBase () {
    return Item.getBaseRecursive({ item: this }, false);
  }

  getPath () {
    return Item.getBaseRecursive({ item: this });
  }

  static getBaseRecursive ({ item, path = [] }, self = true) {
    if (self) {
      path.push(item.id);
    }
    if (item.parent) {
      return Item.getBaseRecursive({
        item: item.parent,
        path
      });
    } else {
      // remove Root
      path = path.reverse();
      if (path[0] === ROOT_ID) {
        path.shift();
      }
      if (path.length > 0) {
        return `${path[0]}:${path.slice(1, path.length).join(PATH_SEPARATOR)}`;
      } else {
        return ROOT_ID;
      }
    }
  }
}

errorMessage.add([
  [
    'FileSystemItem_itemLocked', [
      'Item Locked', 'Item is locked, can\'t be edit… %1'
    ]
  ]
]);
