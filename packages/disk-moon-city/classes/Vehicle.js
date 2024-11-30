import Model from './Model.js';
import Storage from './Storage.js';

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

  /**
   * Wenn gesetzt, war das Fahrzeug unterwegs.
   * @type {Boolean}
   */
  arrived = false;

  /**
   * Speicherplatz des Fahrzeugs.
   * @type {import('./Storage.js').default}
   */
  storage;

  constructor({ id, key, weapon, price, armor, maxArmor, storage } = {}) {
    super({ id });
    this.key = key || this.key;
    this.weapon = weapon;
    this.price = price || this.price;
    this.armor = armor || this.armor;
    this.maxArmor = maxArmor || this.maxArmor;
    this.storage = storage ? new Storage(storage) : undefined;
  }

  get isAvailable() {
    return !this.repairing;
  }

  get destroyed() {
    return this.armor <= 0;
  }

  get damaged() {
    return this.armor < this.maxArmor;
  }

  repair() {
    this.repairing = true;
  }

  get available() {
    return !this.repairing && !this.arrived && !this.destroyed;
  }

  get needsRepair() {
    return this.armor < this.maxArmor;
  }

  attack(damage) {
    this.armor = Math.max(this.armor - damage, 0);
  }

  /**
   * Gibt den Preis für die Reparatur zurück.
   * @type {Number}
   */
  get repairPrice() {
    return Math.round(
      ((this.price * (this.maxArmor - this.armor)) / this.maxArmor) * 0.8
    );
  }

  /**
   * Gibt den Verkaufspreis zurück.
   * @type {Number}
   */
  get sellPrice() {
    return Math.round(this.price * (this.armor / this.maxArmor));
  }

  toJSON() {
    return {
      ...super.toJSON(),
      key: this.key,
      weapon: this.weapon && this.weapon.toJSON(),
      price: this.price,
      armor: this.armor,
      maxArmor: this.maxArmor,
      storage: this.storage && this.storage.toJSON()
    };
  }
}
