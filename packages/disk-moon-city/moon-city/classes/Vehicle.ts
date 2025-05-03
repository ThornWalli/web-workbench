import type { VEHICLE_KEY } from '../types';
import Model, { type ModelOptions } from './Model';
import Storage, { type StorageJSON } from './Storage';
import type { VehicleWeaponJSON } from './VehicleWeapon';
import type VehicleWeapon from './VehicleWeapon';

export interface VehicleOptions extends ModelOptions {
  key: VEHICLE_KEY;
  weapon?: VehicleWeapon;
  price?: number;
  armor?: number;
  maxArmor?: number;
  storage?: Storage;
}

export interface VehicleJSON {
  id: string;
  key: string;
  weapon?: VehicleWeaponJSON;
  price: number;
  armor: number;
  maxArmor: number;
  storage?: StorageJSON;
}

export default class Vehicle extends Model {
  static TYPE = 'vehicle';

  /**
   * @description Schlüssel des Fahrzeugs.
   */
  key: VEHICLE_KEY;

  weapon?: VehicleWeapon;

  /**
   * @description Preis des Fahrzeugs.
   */
  price: number = 0;

  /**
   * @description Zustand der Panzerung.
   */
  armor: number = 0;

  /**
   * @description Maximale Panzerung.
   */
  maxArmor: number = 1;

  /**
   * @description Wenn gesetzt, wird Fahrzeug in der nächsten Runde repariert.
   */
  repairing: boolean = false;

  /**
   * @description Wenn gesetzt, war das Fahrzeug unterwegs.
   */
  arrived: boolean = false;

  /**
   * @description Speicherplatz des Fahrzeugs.
   */
  storage?: Storage;

  constructor({
    id,
    key,
    weapon,
    price,
    armor,
    maxArmor,
    storage
  }: VehicleOptions) {
    super({ id });
    this.key = key;
    this.weapon = weapon;
    this.price = price || this.price;
    this.armor = armor || this.armor;
    this.maxArmor = maxArmor || this.maxArmor;
    this.storage = storage ? new Storage(storage) : undefined;
  }

  get isAvailable() {
    return !this.repairing && !this.destroyed;
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

  attack(damage: number) {
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

  override toJSON(): VehicleJSON {
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
