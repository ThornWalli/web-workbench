export default class Storage {
  #locked = false;
  #storage;
  #name;
  #data = {};

  constructor(options) {
    options = Object.assign(
      {
        locked: this.#locked,
        storage: undefined,
        name: undefined
      },
      options
    );
    this.#locked = options.locked;
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

  mount() {
    return new Promise(resolve => {
      resolve(this);
    });
  }

  unmount() {
    return new Promise(resolve => {
      resolve(this);
    });
  }

  load() {
    if (!this.#storage) {
      throw new Error('no storage');
    }
    // TODO: hier könnte man noch etwas machen
    return Promise.resolve(this.#data);
  }

  save(data) {
    if (!this.#storage) {
      throw new Error('no storage');
    }
    // TODO: hier könnte man noch etwas machen
    this.#data = data || this.#data;
    return Promise.resolve(this.#data);
  }
}

export class DummyStorage {
  #items = new Map();

  getItem(name) {
    return this.#items.get(name);
  }

  setItem(name, value) {
    this.#items.set(name, value);
  }

  removeItem(name) {
    this.#items.delete(name);
  }

  clear() {
    this.#items.clear();
  }
}
