import CityHuman from './CityHuman.js';

export default class CityEmployee extends CityHuman {
  /**
   * @type {import('../utils/keys.js').EMPLOYEE_TYPE}
   */
  type;

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

  constructor({ type, training, trained, trainingCosts, ...options } = {}) {
    super(options);
    this.type = type || this.type;
    this.training = training || this.training;
    this.trained = trained || this.trained;
    this.trainingCosts = trainingCosts || this.trainingCosts;
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

  toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
      training: this.training,
      trained: this.trained,
      trainingCosts: this.trainingCosts
    };
  }
}
