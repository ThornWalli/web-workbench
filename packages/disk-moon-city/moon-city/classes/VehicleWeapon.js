import Model from './Model';

export default class VehicleWeapon extends Model {
  /**
   * Schlüssel der Waffe.
   * @type {String}
   */
  key = 'weapon';

  /**
   * Schaden der Waffe.
   * @type {Number}
   */
  damage = 0;

  constructor({ id, key, damage } = {}) {
    super({ id });
    this.key = key || this.key;
    this.damage = damage || this.damage;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      key: this.key,
      damage: this.damage
    };
  }
}
