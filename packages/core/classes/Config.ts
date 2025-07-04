import { reactive } from 'vue';
import type { Reactive } from 'vue';
import { getStorageByType, TYPE as STORAGE_TYPE } from '../utils/storage';

import type { ConfigObservable } from './Core/types';
import type { RawListData } from './FileSystem/types';
import { getConfigDefaults } from './Core/utils';
import type SessionStorage from './Storage/SessionStorage';

type ConfigEntries = Map<string, unknown>;

export default class Config<
  TStorage = SessionStorage<RawListData[]>,
  TData = RawListData[]
> {
  entries: ConfigEntries = new Map(Object.entries(getConfigDefaults()));
  observable: Reactive<ConfigObservable> = reactive(getConfigDefaults());
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
        this.entries = new Map([
          ...this.entries,
          ...(data as Iterable<[string, TData]>)
        ]);
        Object.assign(this.observable, Object.fromEntries(this.entries));
        return this;
      })
      .catch(err => {
        throw err;
      });
  }

  setDefaults(properties: { [key: string]: unknown }) {
    return Promise.all(
      Object.keys(properties).map(name => {
        if (!this.has(name)) {
          this.set(name, properties[String(name)]);
        }
      })
    );
  }

  get<TValue = unknown>(name: string) {
    return this.entries.get(name) as TValue;
  }

  has(name: string) {
    return this.entries.has(name);
  }

  set<TTest>(name: TTest, value?: unknown) {
    if (typeof name === 'string') {
      this.entries.set(name, value);
      this.observable[String(name)] = value;
    } else if (name && typeof name === 'object' && !(name instanceof Map)) {
      Object.keys(name).forEach(key => {
        value = (name as Record<string, unknown>)[key];
        this.entries.set(key, value);
        this.observable[key] = value;
      });
    }
    // if (typeof name === 'string') {
    //   this.entries.set(name, value);
    //   this.observable[String(name)] = value;
    // } else if (!(name instanceof Map)) {
    //   Object.keys(name).forEach(n => {
    //     value = name[String(n)];
    //     this.entries.set(n, value);
    //     this.observable[String(n)] = value;
    //   });
    // } else if (typeof name === 'object') {
    //   Object.keys(name).forEach(n => {
    //     value = name[String(n)];
    //     this.entries.set(n, value);
    //     this.observable[String(n)] = value;
    //   });
    // }
    return this.storage.save(Array.from(this.entries) as TData);
  }
}
