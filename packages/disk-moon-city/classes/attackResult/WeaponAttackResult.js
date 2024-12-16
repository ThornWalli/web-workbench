import { ATTACK_TYPE } from '../../utils/keys.js';
import AttackResult from '../AttackResult.js';

export default class WeaponAttackResult extends AttackResult {
  /**
   * @type {Weapon}
   */
  weapon;

  /**
   * @type {Number}
   * @description Schutzschild
   * @example 3.2
   */
  shield;

  /**
   * @type {Boolean}
   */
  shieldExists;

  constructor({ weapon, shield, shieldExists, ...options } = {}) {
    super({ ...options, type: ATTACK_TYPE.WEAPON });
    this.weapon = weapon;
    this.shield = shield || this.shield;
    this.shieldExists = shieldExists || this.shieldExists;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      weapon: this.weapon.toJSON(),
      shield: this.shield,
      shieldExists: this.shieldExists
    };
  }
}
