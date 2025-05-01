import type { RawListData, RawObjectData } from '../FileSystem/types';
import { StorageAdapter } from '../StorageAdapter';
import BaseStorage from './index';

// interface StorageWithGetItem {
//   getItem(key: string): string | null;
//   setItem(key: string, value: string): void;
// }

export default class WebStorage<
  TStorage = StorageAdapter,
  TData = RawListData[] | RawObjectData
> extends BaseStorage<TStorage, TData> {
  override async mount() {
    let data;

    if (this.storage instanceof BaseStorage) {
      const storage = this.storage as BaseStorage<TStorage, TData>;
      try {
        data = storage.getItem(this.name) as string;
        if (data) {
          data = JSON.parse(data);
          if (!data || !(data instanceof Object)) {
            throw new Error('json invalid');
          }
        } else {
          throw new Error('json invalid');
        }
      } catch (error) {
        console.error(error);
        data = {};
      }

      this.storage.setItem(this.name, data);
    }
    return this;
  }

  override async load(): Promise<TData> {
    if (this.storage && this.storage instanceof StorageAdapter) {
      this.data = JSON.parse(
        ((this.storage as StorageAdapter<TData>).getItem(
          this.name
        ) as string) || '[]'
      ) as TData;
    }
    return this.data;
  }

  override async save(data?: TData) {
    if (this.storage && this.storage instanceof StorageAdapter) {
      this.data = data || this.data;
      (this.storage as StorageAdapter<TData>).setItem(this.name, this.data);
    }
    return this.data;
  }
}
