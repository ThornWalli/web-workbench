import type { StorageOptions } from '.';
import LocalStorageAdapter from '../StorageAdapter/LocalStorageAdapter';
import WebStorage from './WebStorage';

export default class LocalStorage<TData> extends WebStorage<
  LocalStorageAdapter,
  TData
> {
  constructor(options: Partial<StorageOptions<LocalStorageAdapter>>) {
    super({
      ...options,
      storage: new LocalStorageAdapter()
    } as StorageOptions<LocalStorageAdapter>);
  }
}
