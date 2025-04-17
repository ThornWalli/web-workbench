export interface StorageOptions<TStorage> {
  locked?: boolean;
  storage?: TStorage;
  name: string;
}

export default class Storage<TStorage> {
  #locked = false;
  #storage?: TStorage;
  #name: string;
  #data: object = {};

  constructor(options: StorageOptions<TStorage>) {
    this.#locked = options.locked || this.#locked;
    this.#storage = options.storage;
    this.#name = options.name;
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
  mount(...args: unknown[]) {
    return new Promise(resolve => {
      resolve(this);
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unmount(...args: unknown[]) {
    return new Promise(resolve => {
      resolve(this);
    });
  }

  getItem() {
    throw new Error('not implemented');
  }
  setItem() {
    throw new Error('not implemented');
  }

  load() {
    if (!this.#storage) {
      throw new Error('no storage');
    }
    // TODO: hier könnte man noch etwas machen
    return Promise.resolve(this.#data);
  }

  save(data: object) {
    if (!this.#storage) {
      throw new Error('no storage');
    }
    // TODO: hier könnte man noch etwas machen
    this.#data = data || this.#data;
    return Promise.resolve(this.#data);
  }
}

export interface IStorage {
  getItem(name: string): string;
  setItem(name: string, value: unknown): void;
  removeItem(name: string): void;
  clear(): void;
  isLogged(): boolean;
}

export class MapStorage implements IStorage {
  isLogged(): boolean {
    return true;
  }
  #items = new Map();

  getItem(name: string) {
    return this.#items.get(name);
  }

  setItem(name: string, value: unknown) {
    this.#items.set(name, value);
  }

  removeItem(name: string) {
    this.#items.delete(name);
  }

  clear() {
    this.#items.clear();
  }
}
