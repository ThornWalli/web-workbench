import type { ConsoleGroup } from '../observables/roundComplete/types';
import type Player from './Player';
import type { PlayerJSON } from './Player';

export interface RoundLogOptions {
  index?: number;
  player: Player;
  lines?: ConsoleGroup[];
}

export interface RoundLogJSON {
  index: number;
  player: PlayerJSON;
  lines: ConsoleGroup[];
}

export default class RoundLog {
  index: number = 0;
  /**
   * @description Clone of Player
   */
  player: PlayerJSON;
  lines: ConsoleGroup[] = [];

  constructor({ index, player, lines }: RoundLogOptions) {
    this.index = index || 0;
    this.player = player.toJSON();
    this.lines = lines || [];
  }

  add(...line: ConsoleGroup[]) {
    this.lines.push(...line);
    return this;
  }

  toJSON(): RoundLogJSON {
    return {
      index: this.index,
      player: this.player,
      lines: this.lines
    };
  }
}
