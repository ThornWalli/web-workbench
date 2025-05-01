import type { StorageOptions } from '.';
import SessionStorageAdapter from '../StorageAdapter/SessionStorageAdapter';
import WebStorage from './WebStorage';

export default class SessionStorage<TData> extends WebStorage<
  SessionStorageAdapter,
  TData
> {
  constructor(options: Partial<StorageOptions<SessionStorageAdapter>>) {
    super({
      ...options,
      storage: new SessionStorageAdapter()
    } as StorageOptions<SessionStorageAdapter>);
  }
}
