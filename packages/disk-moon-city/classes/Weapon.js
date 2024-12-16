import Model from './Model.js';

export default class Weapon extends Model {
  static TYPE = 'weapon';

  /**
   * @type {String}
   */
  key = null;

  /**
   * @type {String}
   */
  description = null;

  /**
   * @type {Number}
   */
  maxDamage = 0;

  /**
   * @type {Number}
   */
  damage = 0;

  /**
   * @type {Number}
   */
  price = 0;

  constructor({ id, key, description, maxDamage, damage, price } = {}) {
    super({ id });
    this.key = key || this.key;
    this.description = description || this.description;
    this.maxDamage = maxDamage || this.maxDamage;
    this.damage = damage || this.damage;
    this.price = price || this.price;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      key: this.key,
      description: this.description,
      maxDamage: this.maxDamage,
      damage: this.damage,
      price: this.price
    };
  }
}
