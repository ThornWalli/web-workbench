import City from './City.js';
import Model from './Model.js';

export default class Player extends Model {
  /**
   * @type {Number}
   */
  index;

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
  credits = 12000;

  /**
   * @type {import("./City.js").default}
   */
  city;

  /**
   * @type {import("./RoundLog.js").default[]}
   **/
  roundLogs = [];

  constructor({ index, id, name, credits, city } = {}) {
    super({ id });
    this.index = index;
    this.name = name;
    this.credits = credits || this.credits;
    this.city = new City(city);
    this.city.player = this;
  }

  get currentLog() {
    return this.roundLogs[this.roundLogs.length - 1];
  }
  get lastLog() {
    return this.roundLogs[this.roundLogs.length - 2];
  }

  toSnapshot() {
    return {
      ...super.toSnapshot(),
      city: this.city.toSnapshot(),
      killed: this.killed,
      name: this.name,
      credits: this.credits
    };
  }

  toJSON() {
    return {
      ...super.toJSON(),
      index: this.index,
      city: this.city.toJSON(),
      killed: this.killed,
      name: this.name,
      credits: this.credits,
      roundLogs: this.roundLogs.map(log => log.toJSON())
    };
  }
}
