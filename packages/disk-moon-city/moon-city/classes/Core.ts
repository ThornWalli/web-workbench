import { COMPLETE_TYPE } from '../types';
import Player from './Player';
import RoundComplete from './RoundComplete';

const MAX_PLAYERS = 4;

export default class Core {
  date: Date = getDate();

  /**
   * @description Spiel gestartet
   **/
  started: boolean = false;

  /**
   * @description Spieler
   */
  players: Player[] = [];

  /**
   * @description Aktueller Spieler Index
   */
  playerIndex: number = -1;

  /**
   * @description Aktuelle Runde
   */
  round: number = 0;

  /**
   * @description Aktueller Spieler
   */
  currentPlayer?: Player;

  get isLastPlayer() {
    return this.playerIndex >= this.players.length - 1;
  }

  createPlayer(name: string) {
    if (this.players.length < MAX_PLAYERS) {
      const player = new Player({
        name,
        index: this.players.length
      });
      player.core = this;
      this.players.push(player);
      return player;
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
  restart() {
    this.started = false;
    this.playerIndex = 0;
    this.currentPlayer = undefined;
    this.round = 0;
    this.players = [];
  }
  async nextRound() {
    console.log('next round', this.round);
    this.round++;
    this.nextPlayer(0);
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

  nextPlayer(index = (this.playerIndex + 1) % this.players.length) {
    this.playerIndex = index;
    this.currentPlayer = this.players[this.playerIndex];

    // new round
    const roundComplete = new RoundComplete(this);
    return roundComplete.start(this.currentPlayer);
  }
}

const getDate = () => {
  const date = new Date();
  date.setFullYear(2038);
  return date;
};
