import type { StorageOptions } from '.';
import BaseStorage from '.';
import FallbackAdapter from '../StorageAdapter/FallbackAdapter';

export default class TempStorage<TData> extends BaseStorage<
  FallbackAdapter,
  TData
> {
  constructor(options: Partial<StorageOptions<FallbackAdapter>>) {
    super({
      ...options,
      storage: new FallbackAdapter()
    } as StorageOptions<FallbackAdapter>);
  }
}
