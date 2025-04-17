import { reactive, type Reactive } from 'vue';
import { getStorageByType, TYPE as STORAGE_TYPE } from '../utils/storage';

export default class Config {
  entries = new Map();
  observable: Reactive<{ [key: string]: unknown }> = reactive({});
  storage;
  ready;

  constructor(name: string, storageType: STORAGE_TYPE) {
    const Storage = getStorageByType(storageType || STORAGE_TYPE.NONE);

    this.storage = new Storage({
      name
    });

    this.ready = this.storage
      .load()
      .then(data => {
        this.entries = new Map(data as Map<string, unknown>);
        Object.assign(this.observable, Object.fromEntries(this.entries));
        return this;
      })
      .catch(err => {
        throw err;
      });
  }

  setDefaults(properties: { [key: string]: unknown }) {
    Object.keys(properties).forEach(name => {
      if (!this.has(name)) {
        this.set(name, properties[String(name)]);
      }
    });
  }

  get(name: string) {
    return this.entries.get(name);
  }

  has(name: string) {
    return this.entries.has(name);
  }

  set(name: string | Map<string, unknown>, value: unknown) {
    if (typeof name === 'object' && !(name instanceof Map)) {
      Object.keys(name).forEach(n => {
        value = name[String(n)];
        this.entries.set(n, value);
        this.observable[String(n)] = value;
      });
    } else {
      this.entries.set(name, value);
      this.observable[String(name)] = value;
    }
    return this.storage.save(Array.from(this.entries));
  }
}
