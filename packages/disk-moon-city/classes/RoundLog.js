import Player from './Player.js';

export default class RoundLog {
  /**
   * @type {number}
   */
  index = 0;

  /**
   * Clone of Player
   * @type {import('./Player.js').default}
   */
  player;

  /**
   * @type {Array}
   */
  lines = [];

  constructor({ index, player, lines } = {}) {
    this.index = index || 0;
    this.player = new Player(player.toSnapshot());
    this.lines = lines || [];
  }

  add(...line) {
    this.lines.push(...line);
    return this;
  }
}
