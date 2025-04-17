import type { ItemOptions, ItemStaticOptions } from '../Item';
import ItemContainer from '../ItemContainer';
import type Storage from '../../Storage';
import type { IStorage } from '../../Storage';

export interface ItemStorageOptions<TStorage> extends ItemOptions {
  storage: Storage<TStorage>;
}
export default class ItemStorage<TStorage = IStorage> extends ItemContainer {
  static TYPE = 'Storage';
  #storage: Storage<TStorage>;
  constructor(
    options: ItemStorageOptions<TStorage>,
    staticOptions: ItemStaticOptions
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
