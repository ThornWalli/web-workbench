import type { ItemStaticOptions } from '../Item';
import ItemContainer, { type ItemContainerOptions } from '../ItemContainer';
import type BaseStorage from '../../Storage';

export interface ItemStorageOptions<TStorage> extends ItemContainerOptions {
  storage: TStorage;
}

export default class ItemStorage<
  TStorage extends BaseStorage
> extends ItemContainer {
  static TYPE = 'Storage';
  #storage: TStorage;
  constructor(
    options: ItemStorageOptions<TStorage>,
    staticOptions?: ItemStaticOptions
  ) {
    options = { ...options, locked: true };
    super(options, staticOptions);
    this.#storage = options.storage;
  }

  get storage() {
    return this.#storage;
  }

  override get locked() {
    return this.#storage.locked;
  }

  mount(...args: unknown[]) {
    return this.#storage.mount(...args);
  }

  unmount(...args: unknown[]) {
    return this.#storage.unmount(...args);
  }

  override async save() {
    return this.#storage.save(await this.export());
  }
}
