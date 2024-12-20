import { PLAYER_STATUS } from '../utils/keys.js';
import City from './City.js';
import Model from './Model.js';

export default class Player extends Model {
  /**
   * @type {import("./Core.js").default}
   */
  core;

  /**
   * @type {Number}
   */
  index;

  /**
   * @type {String}
   */
  status = PLAYER_STATUS.PLAYING;

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
  // credits = 12000;
  get credits() {
    console.warn('deprecated player.credits');
    return this.city.credits;
  }
  set credits(value) {
    console.warn('deprecated player.credits');
    this.city.credits = value;
  }

  /**
   * @type {import("./City.js").default}
   */
  city;

  /**
   * @type {import("./RoundLog.js").default[]}
   **/
  roundLogs = [];

  constructor({ index, id, name, city, status } = {}) {
    super({ id });
    this.index = index;
    this.name = name;
    this.city = new City({ ...city, player: this });
    this.status = status || PLAYER_STATUS.PLAYING;
  }

  get currentLog() {
    return this.roundLogs[this.roundLogs.length - 1];
  }
  get lastLog() {
    return this.roundLogs[this.roundLogs.length - 2];
  }

  checkStatus() {
    if (this.city.buildings.length < 1) {
      this.status = PLAYER_STATUS.GAME_LOST;
    }
  }

  toSnapshot() {
    return {
      ...super.toSnapshot(),
      city: this.city.toSnapshot(),
      killed: this.killed,
      index: this.index,
      name: this.name,
      status: this.status
    };
  }

  isPlaying() {
    return this.status === PLAYER_STATUS.PLAYING;
  }

  isWon() {
    return this.status === PLAYER_STATUS.GAME_WON;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      city: this.city.toJSON(),
      killed: this.killed,
      index: this.index,
      name: this.name,
      roundLogs: this.roundLogs.map(log => log.toJSON())
    };
  }
}
