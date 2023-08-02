import ItemContainer from '../ItemContainer';

export default class Storage extends ItemContainer {
  static NAME = 'Storage';
  #storage;
  constructor (options) {
    options = Object.assign({ storage: null }, options, { locked: true });
    super(options);
    this.#storage = options.storage;
  }

  get storage () {
    return this.#storage;
  }

  get locked () {
    return this.#storage.locked;
  }

  mount (...args) {
    return this.#storage.mount(...args);
  }

  unmount (...args) {
    return this.#storage.unmount(...args);
  }

  async save () {
    return this.#storage.save(await this.export());
  }
}
