import City from './City.js';
import Model from './Model.js';

export default class Player extends Model {
  /**
   * @type {Boolean}
   */
  killed = false;

  /**
   * @type {String}
   */
  name;

  /**
   * @type {Number}
   */
  credits = 0;

  /**
   * @type {import("./City.js").default}
   */
  city;

  /**
   * @type {import("./RoundLog.js").default[]}
   **/
  roundLogs = [];

  constructor({ id, name, credits, city } = {}) {
    super({ id });
    this.name = name;
    this.credits = credits || this.credits;
    this.city = city || new City();
    this.city.player = this;
  }

  get currentLog() {
    return this.roundLogs[this.roundLogs.length - 1];
  }

  toJSON() {
    return {
      ...super.toJSON(),
      killed: this.killed,
      name: this.name,
      credits: this.credits
    };
  }
}
