import { reactive, type Reactive } from 'vue';
import { getStorageByType, TYPE as STORAGE_TYPE } from '../utils/storage';
import type { RawListData } from './FileSystem/Item';

type ConfigEntries = Map<string, unknown>;

export default class Config<TStorage, TData = RawListData[]> {
  entries: ConfigEntries = new Map();
  observable: Reactive<{ [key: string]: unknown }> = reactive({});
  storage;
  ready;

  constructor(name: string, storageType: STORAGE_TYPE) {
    const Storage = getStorageByType<TStorage, TData>(
      storageType || STORAGE_TYPE.NONE
    );

    this.storage = new Storage({
      name
    });

    this.ready = this.storage
      .load()
      .then(data => {
        this.entries = new Map(data as Iterable<[string, TData]>);
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

  get<TValue = unknown>(name: string) {
    return this.entries.get(name) as TValue;
  }

  has(name: string) {
    return this.entries.has(name);
  }

  set(name: string | Map<string, unknown>, value: unknown) {
    if (typeof name === 'string') {
      this.entries.set(name, value);
      this.observable[String(name)] = value;
    } else if (!(name instanceof Map)) {
      Object.keys(name).forEach(n => {
        value = name[String(n)];
        this.entries.set(n, value);
        this.observable[String(n)] = value;
      });
    }
    return this.storage.save(Array.from(this.entries) as TData);
  }
}
