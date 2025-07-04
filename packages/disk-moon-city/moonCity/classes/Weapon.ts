import type { WEAPON_KEY } from '../types';
import Model from './Model';
import type { ModelJSON, ModelOptions } from './Model';

export interface WeaponOptions extends ModelOptions {
  key: WEAPON_KEY;
  description?: string;
  maxDamage: number;
  damage: number;
  price: number;
}

export interface WeaponJSON extends ModelJSON {
  key: string;
  description?: string;
  maxDamage: number;
  damage: number;
  price: number;
}

export default class Weapon extends Model {
  static TYPE = 'weapon';

  key: WEAPON_KEY;
  description?: string;
  maxDamage = 0;
  damage = 0;
  price = 0;

  constructor({
    key,
    description,
    maxDamage,
    damage,
    price,
    ...options
  }: WeaponOptions) {
    super(options);
    this.key = key;
    this.description = description;
    this.maxDamage = maxDamage || this.maxDamage;
    this.damage = damage || this.damage;
    this.price = price || this.price;
  }

  override toJSON(): WeaponJSON {
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
