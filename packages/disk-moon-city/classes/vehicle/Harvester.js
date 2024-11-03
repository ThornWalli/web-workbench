import { STORAGE_TYPE } from '../../utils/keys';
import Vehicle from '../Vehicle';

export default class Harvester extends Vehicle {
  /**
   * @type {STORAGE_TYPE}
   */
  resource = STORAGE_TYPE.NONE;

  /**
   * Speicherplatz des Fahrzeugs.
   * @type {Number}
   */
  storage = 0;

  /**
   * Maximale Speicherplatz.
   * @type {Number}
   */
  maxStorage = 0;

  constructor({ resource, storage, maxStorage, ...options } = {}) {
    super(options);
    this.resource = resource || this.resource;
    this.storage = storage || this.storage;
    this.maxStorage = maxStorage || this.maxStorage;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      storage: this.storage,
      maxStorage: this.maxStorage
    };
  }
}
