import type { RawListData, RawObjectData } from '../FileSystem/types';
import type { IStorageAdapter, StorageAdapter } from '../StorageAdapter';

export interface StorageOptions<TStorageAdapter = IStorageAdapter> {
  id?: string;
  storage: TStorageAdapter;
  name: string;
  get locked(): boolean;
}

export default class Storage<
  TStorageAdapter = StorageAdapter,
  TData = RawListData[] | RawObjectData
> {
  id?: string;
  _locked = false;
  storage: TStorageAdapter;
  name: string;
  _data: TData = [] as TData;

  constructor(options: StorageOptions<TStorageAdapter>) {
    this.id = options.id;
    this._locked = options.locked || this._locked;
    this.storage = options.storage;
    this.name = options.name;
  }

  get locked() {
    return this._locked;
  }

  get data() {
    return this._data;
  }

  set data(data) {
    this._data = data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async mount(...args: unknown[]) {
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async unmount(...args: unknown[]) {
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getItem(name: string): TData {
    throw new Error('not implemented');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setItem(name: string, value: TData) {
    throw new Error('not implemented');
  }

  async load() {
    if (!this.storage) {
      throw new Error('no storage');
    }
    // TODO: hier könnte man noch etwas machen
    return this._data;
  }

  async save(data: TData) {
    if (!this.storage) {
      throw new Error('no storage');
    }
    // TODO: hier könnte man noch etwas machen
    this._data = data || this._data;
    return this._data;
  }
}

export interface IStorage {
  getItem(name: string): string;
  setItem(name: string, value: unknown): void;
  removeItem(name: string): void;
  clear(): void;
  isLogged(): boolean;
}

// export class FallbackStorage extends Storage<IStorageAdapter, string> {
//   isLogged(): boolean {
//     return true;
//   }
//   #items = new Map();

//   override getItem(name: string) {
//     return this.#items.get(name);
//   }

//   override setItem(name: string, value: unknown) {
//     this.#items.set(name, value);
//   }

//   removeItem(name: string) {
//     this.#items.delete(name);
//   }

//   clear() {
//     this.#items.clear();
//   }
// }
