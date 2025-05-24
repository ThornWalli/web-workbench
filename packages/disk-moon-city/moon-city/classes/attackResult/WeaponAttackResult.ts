import { ATTACK_TYPE } from '../../types';
import AttackResult, {
  type AttackResultJSON,
  type IAttackResult
} from '../AttackResult';
import type { WeaponJSON } from '../Weapon';
import type Weapon from '../Weapon';

export interface WeaponAttackResultOptions extends IAttackResult {
  weapon: Weapon;
  shield: number[];
  shieldExists?: boolean;
}
export interface WeaponAttackResultJSON extends AttackResultJSON {
  weapon: WeaponJSON;
  shield: number[];
  shieldExists: boolean;
}

export default class WeaponAttackResult extends AttackResult {
  weapon: Weapon;

  /**
   * @description Schutzschild
   */
  shield: number[];

  shieldExists: boolean = false;

  constructor({
    weapon,
    shield,
    shieldExists,
    ...options
  }: WeaponAttackResultOptions) {
    super({ ...options, type: ATTACK_TYPE.WEAPON });
    this.weapon = weapon;
    this.shield = shield;
    this.shieldExists = shieldExists || this.shieldExists;
  }

  override toJSON(): WeaponAttackResultJSON {
    return {
      ...super.toJSON(),
      weapon: this.weapon.toJSON(),
      shield: this.shield,
      shieldExists: this.shieldExists
    };
  }
}
