import { Subject } from 'rxjs';
import { IPoint } from '@js-basics/vector';

import errorMessage from '../../services/errorMessage';
import {
  getExt,
  ROOT_ID,
  formatId,
  PATH_SEPARATOR
} from '../../utils/fileSystem';
import { SYMBOL } from '../../utils/symbols';
import Event from '../Event';
import { btoa } from '../../utils/helper';
import type ItemContainer from './ItemContainer';

export const ITEM_META = {
  SYMBOL: 'symbol',
  VISIBLE: 'visible',
  POSITION: 'position',
  WINDOW_SYMBOL_REARRANGE: 'window_symbol_rearrange',
  WINDOW_SIZE: 'window_size',
  WINDOW_POSITION: 'window_position',
  WINDOW_SCALE: 'window_scale',
  WINDOW_SCROLL_X: 'window_scroll_x',
  WINDOW_SCROLL_Y: 'window_scroll_y',
  WINDOW_FULL_SIZE: 'window_full_size',
  WINDOW_SIDEBAR: 'window_sidebar',
  WEB_URL: 'web_url',
  IGNORE_SYMBOL_REARRANGE: 'ignore_symbol_rearrange'
};

export enum EXT_SYMBOLS {
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  basic = SYMBOL.BASIC,
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  bas = SYMBOL.BASIC,
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  markdown = SYMBOL.DISK_MARKDOWN,
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  md = SYMBOL.DISK_MARKDOWN,
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  image = SYMBOL.IMAGE,
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  img = SYMBOL.IMAGE
}
function getSymbolByExt(name: string, defaultSymbol = SYMBOL.NOTE_BLANK) {
  const symbols = EXT_SYMBOLS as { [key: string]: string };
  const ext = getExt(name).toLowerCase();
  return symbols[String(ext)] || defaultSymbol;
}

export type ItemMetaValue = boolean | string | IPoint | number | object | null;
export interface ItemOptions {
  locked?: boolean;
  id: string;
  name?: string;
  meta?: [string, ItemMetaValue][];
  data?: unknown;
  action?: unknown;
  createdDate?: number;
  editedDate?: number;
  symbol?: SYMBOL;
}
export interface ItemStaticOptions {
  type: string;
  symbol?: SYMBOL;
}
export default class Item {
  #type: string;

  #events: Subject<Event>;
  #locked = false;
  #parent?: ItemContainer;

  #createdDate: number;
  #editedDate: number;

  #id: string;
  #name?: string;

  #meta: Map<string, ItemMetaValue>;

  #data: object | string;
  #action: unknown;

  // eslint-disable-next-line complexity
  constructor(
    options: ItemOptions,
    { type, symbol = SYMBOL.NOTE_BLANK }: ItemStaticOptions = {
      type: 'Unknown',
      symbol: SYMBOL.NOTE_BLANK
    }
  ) {
    const {
      locked = false,
      id,
      name = undefined,
      meta = undefined,
      data = undefined,
      action = undefined,
      createdDate = Date.now(),
      editedDate = undefined
    } = options;

    this.#events = new Subject();
    this.#createdDate = createdDate || Date.now();
    this.#editedDate = editedDate || createdDate;
    this.#locked = locked || false;
    this.#id = id;
    this.#name = name;

    this.#type = type || 'Unknown';

    this.#meta = new Map([
      // FIXME: Smybol wird jetyt erstmal blank sein.
      [ITEM_META.SYMBOL, getSymbolByExt(id || '', symbol || SYMBOL.NOTE_BLANK)],
      [ITEM_META.VISIBLE, true],
      ...(meta || [])
    ]);

    let prePreparedData = data;
    if (typeof data === 'string') {
      try {
        prePreparedData = JSON.parse(data);
      } catch (error) {
        console.log(prePreparedData);
        throw error;
      }
    }

    this.#action = action;
    this.#data = prepareDataForItem(prePreparedData || {});
  }

  // FIXME: was macht das recursive?
  async remove(options: { silent?: boolean; recursive?: boolean } = {}) {
    const { silent } = Object.assign(
      {
        silent: false
      },
      options
    );
    let info;
    const locked = this.isLocked();
    if (!locked) {
      info = {
        type: this.type,
        id: this.id,
        name: this.name,
        path: await this.getPath(),
        size: this.size,
        storage: this.getStorageItem()
      };
    } else if (!silent) {
      return errorMessage.get(
        'FileSystemItem_itemLocked',
        await this.getPath()
      );
    }

    if (silent || !locked) {
      this.events.next(
        new Event({
          name: 'remove',
          value: this
        })
      );
      this.events.unsubscribe();
      this.parent?.removeItem(this);
    }
    return info;
  }

  isLocked(ignore = false) {
    if (ignore) {
      return false;
    }
    if (this.parent && this.parent.locked && this.parent.id !== ROOT_ID) {
      return true;
    }
    return this.#locked;
  }

  getStorageItem(): Item | undefined {
    if ('storage' in this) {
      return this;
    } else if (this.parent) {
      return this.parent.getStorageItem();
    }
  }

  async copy() {
    const Class = this.constructor as new (...args: unknown[]) => Item;
    const itemData = await this.export({
      encodeData: false
    });
    const item = new Class(itemData);
    return Promise.resolve(item);
  }

  rename(id: string, options: { name?: boolean; ignore?: boolean } = {}) {
    const { name = false, ignore = false } = Object.assign(
      { name: false, ignore: false },
      options
    );
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
      this.events.next(
        new Event({
          name: 'rename',
          value: { name, id }
        })
      );
    }
    return this;
  }

  save() {
    this.events.next(
      new Event({
        name: 'save',
        value: this
      })
    );
  }

  get type() {
    return this.#type;
  }

  async export(options: { encodeData?: boolean } = {}) {
    const { encodeData } = Object.assign({ encodeData: true }, options);

    const meta = new Map(this.#meta);
    Array.from(meta.keys()).forEach(key => {
      if (meta.get(key) instanceof IPoint) {
        meta.set(key, (meta.get(key) as IPoint).toJSON());
      }
    });
    let data;
    if (encodeData && typeof this.#data === 'string') {
      data = await btoa(this.#data);
    } else {
      data = this.#data;
    }
    return {
      type: this.type,
      id: this.#id,
      name: this.#name,
      createdDate: this.#createdDate,
      editedDate: this.#editedDate,
      data,
      meta: Array.from(meta)
    };
  }

  get createdDate() {
    return this.#createdDate;
  }

  get editedDate() {
    return this.#editedDate;
  }

  get data() {
    if (typeof this.#data === 'string') {
      try {
        return JSON.parse(this.#data);
      } catch (error) {
        console.error(error);
        return { data: this.#data };
      }
    }
    return this.#data;
  }

  set data(value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    this.#data = value;
  }

  get action() {
    return this.#action;
  }

  get events() {
    return this.#events;
  }

  get parent() {
    return this.#parent;
  }

  setId(id: string) {
    this.#id = id;
  }

  setParent(parent: ItemContainer) {
    this.#parent = parent;
  }

  get locked(): boolean {
    return this.#parent?.locked || this.#locked;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name || this.#id;
  }

  set name(value) {
    this.#name = value;
  }

  get extension() {
    return getExt(this.#id);
  }

  get meta() {
    return this.#meta;
  }

  get size() {
    const data = Object.values<string>(this.data);
    return new Blob(data).size;
  }

  get maxSize() {
    return new Blob(Object.values<string>(this.data)).size;
  }

  getBase() {
    return Item.getBaseRecursive({ item: this }, false);
  }

  getPath() {
    return Item.getBaseRecursive({ item: this });
  }

  static getBaseRecursive(
    {
      item,
      path = []
    }: {
      item: Item | ItemContainer;
      path?: string[];
    },
    self = true
  ): string {
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
        let root = path[0];
        if (!/\./.test(root)) {
          root += ':';
        }
        return `${root}${path.slice(1, path.length).join(PATH_SEPARATOR)}`;
      } else {
        return ROOT_ID;
      }
    }
  }
}

errorMessage.add([
  [
    'FileSystemItem_itemLocked',
    ['Item Locked', "Item is locked, can't be edit… %1"]
  ]
]);

function prepareDataForItem(value: object | string) {
  if (typeof value === 'object') {
    value = JSON.stringify(value);
  }
  return value;
}
