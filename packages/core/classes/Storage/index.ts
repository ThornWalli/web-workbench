import type { RawListData, RawObjectData } from '../FileSystem/Item';
import type { IStorageAdapter, StorageAdapter } from '../StorageAdapter';

export interface StorageOptions<TStorageAdapter = IStorageAdapter> {
  id?: string;
  locked?: boolean;
  storage: TStorageAdapter;
  name: string;
}

export default class Storage<
  TStorageAdapter = StorageAdapter,
  TData = RawListData[] | RawObjectData
> {
  #id?: string;
  #locked = false;
  #storage: TStorageAdapter;
  #name: string;
  #data: TData = [] as TData;

  constructor(options: StorageOptions<TStorageAdapter>) {
    this.#id = options.id;
    this.#locked = options.locked || this.#locked;
    this.#storage = options.storage;
    this.#name = options.name;
  }

  get id() {
    return this.#id;
  }

  get locked() {
    return this.#locked;
  }

  get name() {
    return this.#name;
  }

  get storage() {
    return this.#storage;
  }

  get data() {
    return this.#data;
  }

  set data(data) {
    this.#data = data;
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
    if (!this.#storage) {
      throw new Error('no storage');
    }
    // TODO: hier könnte man noch etwas machen
    return this.#data;
  }

  async save(data: TData) {
    if (!this.#storage) {
      throw new Error('no storage');
    }
    // TODO: hier könnte man noch etwas machen
    this.#data = data || this.#data;
    return this.#data;
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
