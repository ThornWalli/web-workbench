import Model from './Model';
import Storage from './Storage.js';

export default class Building extends Model {
  static TYPE = 'building';

  key = 'building';
  type = [];
  price = 0;

  /**
   * @type {import('./Storage.js').default}
   */
  storage;

  /**
   * @type {Function}
   */
  roundAction = null;

  /**
   * @type {Object.<import('../utils/keys.js').RESOURCE_TYPE, number>}
   */
  roundCost = {};

  /**
   * @type {Object.<import('../utils/keys.js').RESOURCE_TYPE, number>}
   */
  roundProduction = {};

  /**
   * TODO: WOZU?
   */
  properties = {};

  constructor({
    id,
    key,
    description,
    type,
    price,
    properties,
    roundCost,
    roundProduction,
    storage
  } = {}) {
    super({ id });
    this.key = key || this.key;
    this.description = description || this.description;
    this.type = type || this.type;
    this.price = price || this.price;
    this.properties = properties || this.properties;
    this.roundCost = roundCost || this.roundCost;
    this.roundProduction = roundProduction || this.roundProduction;
    this.storage = storage ? new Storage(storage) : undefined;
  }

  /**
   * @param {import('../utils/keys.js').RESOURCE_TYPE} type
   */
  getProductionValue(type) {
    return this.roundProduction[String(type)] || 0;
  }

  /**
   * @param {import('../utils/keys.js').RESOURCE_TYPE} type
   */
  getCostValue(type) {
    return this.roundCost[String(type)] || 0;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      key: this.key,
      description: this.description,
      type: this.type,
      price: this.price,
      properties: this.properties,
      roundCost: this.roundCost,
      roundProduction: this.roundProduction,
      storage: this.storage && this.storage.toJSON()
    };
  }
}
