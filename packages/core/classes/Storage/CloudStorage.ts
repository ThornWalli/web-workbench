import Storage from '.';
import type { StorageOptions } from '.';

export default class CloudStorage<TStorage, TData> extends Storage<
  TStorage,
  TData
> {
  constructor(options: Partial<StorageOptions<TStorage>>) {
    super({
      ...options
    } as StorageOptions<TStorage>);
  }

  isLogged(): boolean {
    throw new Error('Not implemented');
  }
}
