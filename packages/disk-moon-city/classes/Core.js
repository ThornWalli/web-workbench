import { COMPLETE_TYPE } from '../utils/keys.js';
import RoundComplete from './RoundComplete.js';

const MAX_PLAYERS = 4;

export default class Core {
  /**
   * @type {Date}
   */
  date = getDate();

  /**
   * Spiel gestartet
   * @type {Boolean}
   * @default false
   **/
  started = false;

  /**
   * Spieler
   * @type {import("./Player.js").default[]}
   */
  players = [];

  /**
   * Aktueller Spieler Index
   * @type {Number}
   */
  playerIndex = null;

  /**
   * Aktuelle Runde
   * @type {Number}
   */
  round = 0;

  /**
   * Aktueller Spieler
   * @type {import("./Player.js").default}
   */
  currentPlayer = null;

  get isLastPlayer() {
    return this.playerIndex >= this.players.length - 1;
  }

  /**
   *
   * @param {import("./Player.js").default} player
   */
  addPlayer(player) {
    if (this.players.length < MAX_PLAYERS) {
      this.players.push(player);
    } else {
      throw new Error('Max players reached');
    }
  }

  start() {
    console.log('Game started');
    this.playerIndex = 0;
    this.currentPlayer = this.players[this.playerIndex];
    this.round = 1;
    this.started = true;
  }
  async nextRound() {
    console.log('next round', this.round);
    await this.completeRound();
    this.round++;
    this.playerIndex = 0;
    this.currentPlayer = this.players[this.playerIndex];
  }

  async next() {
    if (this.isLastPlayer) {
      await this.nextRound();
      return COMPLETE_TYPE.ROUND;
    } else {
      this.nextPlayer();
      return COMPLETE_TYPE.PLAYER;
    }
  }

  nextPlayer() {
    this.playerIndex = (this.playerIndex + 1) % this.players.length;
    this.currentPlayer = this.players[this.playerIndex];
  }

  completeRound() {
    const roundComplete = new RoundComplete(this);
    return roundComplete.start();
  }
}

const getDate = () => {
  const date = new Date();
  date.setFullYear(2038);
  return date;
};
