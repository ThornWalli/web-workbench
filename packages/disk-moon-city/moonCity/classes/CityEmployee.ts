import type { EMPLOYEE_TYPE } from '../types';
import CityHuman from './CityHuman';
import type { CityHumanJSON, CityHumanOptions } from './CityHuman';

export interface CityEmployeeOptions extends CityHumanOptions {
  type: EMPLOYEE_TYPE;
  training?: boolean;
  trained?: number;
  trainingCosts?: number;
}

export interface CityEmployeeJSON extends CityHumanJSON {
  type: EMPLOYEE_TYPE;
  training: boolean;
  trained: number;
  level: number;
  trainingCosts: number;
}

export default class CityEmployee extends CityHuman {
  type: EMPLOYEE_TYPE;

  /**
   * Legt fest das Training wird.
   * @type {boolean}
   */
  training = false;

  /**
   * Anzahl der ausgebildeten Mitarbeiter.
   */
  trained = 0;

  /**
   * Kosten für Training.
   */
  trainingCosts = 0;

  constructor({
    type,
    training,
    trained,
    trainingCosts,
    ...options
  }: CityEmployeeOptions) {
    super(options);
    this.type = type;
    this.training = training || this.training;
    this.trained = trained || this.trained;
    this.trainingCosts = trainingCosts || this.trainingCosts;
  }

  override remove(value: number) {
    super.remove(value);
    this.trained = Math.max(
      this.trained - (this.trained * Math.max(value, 0)) / this.value,
      0
    );
  }
  /**
   * Traingingslevel der Mitarbeiter.
   * @type {number}
   */
  get level() {
    const value = this.trained / this.value;
    if (isNaN(value)) {
      return 0;
    }
    return value;
  }

  setTraining() {
    this.training = true;
  }

  executeTraining() {
    this.training = false;
    const value = (this.value - this.trained) * 0.25;
    this.trained += value;
    this.trainingCosts += Math.round(this.value * 0.15);
    return value;
  }

  override toJSON(): CityEmployeeJSON {
    return {
      ...super.toJSON(),
      type: this.type,
      training: this.training,
      trained: this.trained,
      level: this.level,
      trainingCosts: this.trainingCosts
    };
  }
}
