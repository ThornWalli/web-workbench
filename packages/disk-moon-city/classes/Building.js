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
   * @type {number}
   */
  roundProductionRatio = 1;

  /**
   * Wenn gesetzt, ist das Gebäude sabotiert.
   * Wird beim nächsten Rundenwechsel zurückgesetzt.
   */
  sabotaged = false;

  constructor({
    id,
    key,
    description,
    type,
    price,
    properties,
    roundCost,
    roundProduction,
    storage,
    roundProductionRatio,
    sabotaged
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
    this.roundProductionRatio =
      roundProductionRatio !== undefined
        ? roundProductionRatio
        : this.roundProductionRatio;
    this.sabotaged = sabotaged !== undefined ? sabotaged : this.sabotaged;
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

  /**
   * @param {import('../utils/keys.js').BUILDING_TYPE} type
   * @returns Boolean
   */
  isType(type) {
    return [].concat(type).some(t => this.type.includes(t));
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
      storage: this.storage && this.storage.toJSON(),
      roundProductionRatio: this.roundProductionRatio,
      sabotaged: this.sabotaged
    };
  }
}
