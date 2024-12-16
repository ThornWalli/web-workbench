import AttackResult from '../AttackResult.js';

export default class EmployeeAttackResult extends AttackResult {
  /**
   * @type {import('../../utils/keys.js').ATTACK_TYPE}
   */
  type;

  /**
   * @type {import('../Player.js').default}
   */
  fromPlayer;

  /**
   * @type {import('../Player.js').default}
   */
  toPlayer;

  /**
   * @type {Boolean}
   */
  successfully = false;

  /**
   * @type {AttackResultEmployeeLoss[]}
   */
  losses = [];

  constructor({
    type,
    fromPlayer,
    toPlayer,
    successfully,
    losses,
    ...options
  }) {
    super(options);
    this.type = type;
    this.fromPlayer = fromPlayer;
    this.toPlayer = toPlayer;
    this.successfully = successfully || this.successfully;
    this.losses = losses || this.losses;
  }

  /**
   * @param {import('../../utils/keys.js').EMPLOYEE_TYPE} key
   * @param {Number} value
   */
  addEmployeeLoss(key, value) {
    this.losses.push(new AttackResultEmployeeLoss({ key, value }));
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
      fromPlayer: this.fromPlayer?.toJSON(),
      toPlayer: this.toPlayer?.toJSON(),
      successfully: this.successfully,
      losses: this.losses.map(loss => loss.toJSON())
    };
  }
}

export class AttackResultEmployeeLoss {
  /**
   * @type {import('../../utils/keys.js').EMPLOYEE_TYPE}
   */
  key;

  /**
   * Anzahl der getöteten Mitarbeiter.
   * @type {Boolean}
   */
  value;

  constructor({ key, value }) {
    this.key = key;
    this.value = value;
  }
  toJSON() {
    return {
      key: this.key,
      value: this.value
    };
  }
}
