import Model from './Model';

export default class Building extends Model {
  static TYPE = 'building';

  key = 'building';
  type = [];
  price = 0;

  /**
   * @type {Function}
   */
  roundAction = null;
  roundCost = {};
  roundProduction = {};

  /**
   * @type {Function}
   */
  roundProductionAction = null;
  properties = {};

  constructor({
    id,
    key,
    description,
    type,
    price,
    properties,
    roundCost,
    roundProduction
  } = {}) {
    super({ id });
    this.key = key || this.key;
    this.description = description || this.description;
    this.type = type || this.type;
    this.price = price || this.price;
    this.properties = properties || this.properties;
    this.roundCost = roundCost || this.roundCost;
    this.roundProduction = roundProduction || this.roundProduction;
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
      roundProduction: this.roundProduction
    };
  }
}
