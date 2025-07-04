import type { ATTACK_TYPE, EMPLOYEE_TYPE } from '../../types';
import AttackResult from '../AttackResult';
import type { AttackResultJSON, IAttackResult } from '../AttackResult';

export interface EmployeeAttackResultOptions extends IAttackResult {
  type: ATTACK_TYPE;
  successfully?: boolean;
  losses?: AttackResultEmployeeLoss[];
}

export interface EmployeeAttackResultJSON extends AttackResultJSON {
  successfully: boolean;
  losses: AttackResultEmployeeLossJSON[];
}

export default class EmployeeAttackResult extends AttackResult {
  successfully: boolean = false;
  losses: AttackResultEmployeeLoss[] = [];

  constructor({
    successfully,
    losses,
    ...options
  }: EmployeeAttackResultOptions) {
    super(options);
    this.successfully = successfully || this.successfully;
    this.losses = losses || this.losses;
  }

  addEmployeeLoss(key: EMPLOYEE_TYPE, value: number) {
    this.losses.push(new AttackResultEmployeeLoss({ key, value }));
  }

  override toJSON(): EmployeeAttackResultJSON {
    return {
      ...super.toJSON(),
      successfully: this.successfully,
      losses: this.losses.map(loss => loss.toJSON())
    };
  }
}

export interface AttackResultEmployeeLossOptions {
  key: EMPLOYEE_TYPE;
  value: number;
}

export interface AttackResultEmployeeLossJSON {
  key: EMPLOYEE_TYPE;
  value: number;
}

export class AttackResultEmployeeLoss {
  key: EMPLOYEE_TYPE;

  /**
   * @description Anzahl der getöteten Mitarbeiter.
   */
  value: number;

  constructor({ key, value }: AttackResultEmployeeLossOptions) {
    this.key = key;
    this.value = value;
  }
  toJSON(): AttackResultEmployeeLossJSON {
    return {
      key: this.key,
      value: this.value
    };
  }
}
