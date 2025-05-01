import ItemContainer from '../ItemContainer';

import type BaseStorage from '../../Storage';
import type { ItemStaticOptions, StorageOptions } from '../types';

export default class ItemStorage<
  TStorage extends BaseStorage
> extends ItemContainer {
  static TYPE = 'Storage';
  storage: TStorage;
  constructor(
    options: StorageOptions<TStorage>,
    staticOptions?: ItemStaticOptions
  ) {
    options = { ...options, locked: true };
    super(options, staticOptions);
    this.storage = options.storage;
  }

  override get locked() {
    return this.storage.locked;
  }

  mount(...args: unknown[]) {
    return this.storage.mount(...args);
  }

  unmount(...args: unknown[]) {
    return this.storage.unmount(...args);
  }

  override async save() {
    return this.storage.save(await this.export());
  }
}
