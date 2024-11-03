import Model from './Model.js';

export default class Vehicle extends Model {
  static TYPE = 'vehicle';

  /**
   * Schlüssel des Fahrzeugs.
   * @type {String}
   */
  key = 'vehicle';

  /**
   * @type {import("./VehicleWeapon.js").default}
   */
  weapon = null;

  /**
   * Preis des Fahrzeugs.
   * @type {Number}
   */
  price = 0;

  /**
   * Zustand der Panzerung.
   * @type {Number}
   */
  armor = 0;

  /**
   * Maximale Panzerung.
   * @type {Number}
   */
  maxArmor = 1;

  /**
   * Wenn gesetzt, wird Fahrzeug in der nächsten Runde repariert.
   * @type {Boolean}
   */
  repairing = false;

  constructor({ id, key, weapon, price, armor, maxArmor } = {}) {
    super({ id });
    this.key = key || this.key;
    this.weapon = weapon;
    this.price = price || this.price;
    this.armor = armor || this.armor;
    this.maxArmor = maxArmor || this.maxArmor;
  }

  repair() {
    this.repairing = true;
  }

  get available() {
    return !this.repairing;
  }

  get needsRepair() {
    return this.armor < this.maxArmor;
  }

  get repairPrice() {
    return (this.maxArmor - this.armor) / this.maxArmor;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      key: this.key,
      weapon: this.weapon && this.weapon.toJSON(),
      price: this.price,
      armor: this.armor,
      maxArmor: this.maxArmor
    };
  }
}
