import { Subject } from 'rxjs';
import { IPoint } from '@js-basics/vector';

import errorMessage from '../../services/errorMessage';
import {
  getExt,
  ROOT_ID,
  formatId,
  PATH_SEPARATOR,
  getStorageItem
} from '../../utils/fileSystem';
import { SYMBOL } from '../../utils/symbols';
import Event from '../Event';
import { btoa } from '../../utils/helper';
import type ItemContainer from './ItemContainer';
import type BaseStorage from '../Storage';
import { markRaw } from 'vue';
import {
  ITEM_META,
  type EventValue,
  type ItemActionCallback,
  type ItemData,
  type ItemDataValue,
  type ItemMetaValue,
  type ItemOptions,
  type ItemRemoveInfo,
  type ItemStaticOptions,
  type RawItemResult
} from './types';

export const EXT_SYMBOLS = {
  basic: SYMBOL.BASIC,
  bas: SYMBOL.BASIC,
  markdown: SYMBOL.DISK_MARKDOWN,
  md: SYMBOL.DISK_MARKDOWN,
  image: SYMBOL.IMAGE,
  img: SYMBOL.IMAGE
};

function getSymbolByExt(name: string, defaultSymbol = SYMBOL.NOTE_BLANK) {
  const symbols = EXT_SYMBOLS as { [key: string]: string };
  const ext = getExt(name).toLowerCase();
  return symbols[ext] || defaultSymbol;
}

export class ItemEvent extends Event<EventValue> {}

export default class Item {
  type: string;

  events: Subject<ItemEvent>;
  _locked = false;
  parent?: ItemContainer;

  createdDate: number;
  editedDate: number;

  id: string;
  _name: string = '';

  meta: Map<ITEM_META, ItemMetaValue>;

  _data: ItemDataValue;
  _action?: ItemActionCallback;

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
      action,
      createdDate = Date.now(),
      editedDate = undefined
    } = options;

    this.events = markRaw(new Subject());
    this.createdDate = createdDate || Date.now();
    this.editedDate = editedDate || createdDate;
    this._locked = locked || false;
    this.id = id;
    this._name = name || '';

    this.type = type || 'Unknown';

    this.meta = new Map([
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

    this._action = action;
    this._data = prepareDataForItem(prePreparedData || {});
  }

  // FIXME: was macht das recursive?
  async remove<TStorage extends BaseStorage = BaseStorage>(
    options: { silent?: boolean; recursive?: boolean } = {}
  ): Promise<ItemRemoveInfo<TStorage>[]> {
    const { silent } = Object.assign(
      {
        silent: false
      },
      options
    );
    let info: ItemRemoveInfo<TStorage> | undefined;
    const locked = this.isLocked();
    if (!locked) {
      info = {
        type: this.type,
        id: this.id,
        name: this.name,
        path: await this.getPath(),
        size: this.size,
        storage: getStorageItem(this)
      };
    } else if (!silent) {
      throw new Error(
        errorMessage
          .get('FileSystemItem_itemLocked', await this.getPath())
          ?.join(' ')
      );
    }

    if (silent || !locked) {
      this.events.next(
        new Event({
          name: 'remove',
          value: {
            item: this
          }
        })
      );
      this.events.unsubscribe();
      this.parent?.removeItem(this);
    }
    return info ? [info] : [];
  }

  isLocked(ignore = false) {
    if (ignore) {
      return false;
    }
    if (this.parent && this.parent.locked && this.parent.id !== ROOT_ID) {
      return true;
    }
    return this._locked;
  }

  async copy() {
    const Class = this.constructor as new (...args: unknown[]) => Item;
    const itemData = await this.export({
      encodeData: false
    });
    const item = new Class(itemData);
    return Promise.resolve(item);
  }

  rename(id?: string, options: { name?: boolean; ignore?: boolean } = {}) {
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
        this.id = formatId(id || '');
        if (this.parent && lastId !== this.id) {
          this.parent.changeItemId(this, lastId, this.id);
        }
      }
      this.events.next(
        new ItemEvent({
          name: 'rename',
          value: { item: this }
        })
      );
    }
    return this;
  }

  save() {
    this.events.next(
      new Event({
        name: 'save',
        value: {
          item: this
        }
      })
    );
  }

  getUsedMemory() {
    return this.size / this.maxSize;
  }

  async export(options: { encodeData?: boolean } = {}): Promise<RawItemResult> {
    const { encodeData } = Object.assign({ encodeData: true }, options);

    const meta = new Map(this.meta);
    Array.from(meta.keys()).forEach(key => {
      if (meta.get(key) instanceof IPoint) {
        meta.set(key, (meta.get(key) as IPoint).toJSON());
      }
    });
    let data;
    if (encodeData && typeof this._data === 'string') {
      data = await btoa(this._data);
    } else {
      data = this._data;
    }
    return {
      type: this.type,
      id: this.id,
      name: this._name,
      createdDate: this.createdDate,
      editedDate: this.editedDate,
      data,
      meta: Array.from(meta)
    };
  }

  get data(): ItemData {
    let data: ItemData = this._data as ItemData;
    if (typeof this._data === 'string') {
      try {
        data = JSON.parse(this._data) as ItemData;
      } catch (error) {
        console.error(error);
        data = {
          type: 'markdown',
          content: 'Cannot parse data',
          data: this._data
        };
      }
    }
    return data;
  }

  set data(value: object | string | null | undefined) {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    this._data = value;
  }

  get action() {
    return this._action;
  }

  setId(id: string) {
    this.id = id;
  }

  setParent(parent?: ItemContainer) {
    this.parent = parent;
  }

  get locked(): boolean {
    return this.parent?.locked || this._locked;
  }

  get name() {
    return this._name || this.id;
  }

  set name(value: string | undefined) {
    this._name = value || '';
  }

  get extension() {
    return getExt(this.id);
  }

  get size() {
    const data = Object.values(this.data || {});
    return new Blob(data).size;
  }

  get maxSize(): number {
    return new Blob(Object.values(this.data || {})).size;
  }

  getRealMaxSize() {
    return new Blob(Object.values(this.data || {})).size;
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
