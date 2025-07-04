import Model, { type ModelJSON, type ModelOptions } from './Model';

export interface VehicleWeaponOptions extends ModelOptions {
  key: string;
  damage: number;
}

export interface VehicleWeaponJSON extends ModelJSON {
  key: string;
  damage: number;
}

export default class VehicleWeapon extends Model {
  /**
   * Schlüssel der Waffe.
   */
  key: string;

  /**
   * Schaden der Waffe.
   */
  damage = 0;

  constructor({ id, key, damage }: VehicleWeaponOptions) {
    super({ id });
    this.key = key;
    this.damage = damage || this.damage;
  }

  override toJSON(): VehicleWeaponJSON {
    return {
      ...super.toJSON(),
      key: this.key,
      damage: this.damage
    };
  }
}
