import Building from '../Building';

export default class Storage extends Building {
  /**
   * @type {Array<STORAGE_TYPE>}
   */
  storageTypes = [];

  /**
   * @type {Number}
   */
  storage = 0;

  constructor(options = {}) {
    super(options);
    const { storageTypes, storage } = options;
    this.storageTypes = storageTypes || {};
    this.storage = storage || this.storage;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      storageTypes: this.storageTypes,
      storage: this.storage
    };
  }
}
