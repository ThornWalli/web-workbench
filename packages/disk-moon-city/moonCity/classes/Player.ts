import { PLAYER_STATUS } from '../types';
import City from './City';
import type { CityJSON, CityOptions } from './City';
import type Core from './Core';
import Model from './Model';
import type { ModelJSON, ModelOptions } from './Model';
import type { RoundLogJSON } from './RoundLog';
import type RoundLog from './RoundLog';

export interface PlayerOptions extends ModelOptions {
  index: number;
  status?: PLAYER_STATUS;
  killed?: boolean;
  name: string;
  city?: CityOptions;
}

export interface PlayerJSON extends ModelJSON {
  index: number;
  status: PLAYER_STATUS;
  killed: boolean;
  name: string;
  city: CityJSON;
  roundLogs: RoundLogJSON[];
}

export default class Player extends Model {
  core?: Core;

  index: number;
  status: PLAYER_STATUS = PLAYER_STATUS.PLAYING;
  killed: boolean = false;
  name: string;

  get credits() {
    console.warn('deprecated player.credits');
    return this.city.credits;
  }
  set credits(value) {
    console.warn('deprecated player.credits');
    this.city.credits = value;
  }

  city: City;
  roundLogs: RoundLog[] = [];

  constructor({ index, id, name, city, status }: PlayerOptions) {
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
  isPlaying() {
    return this.status === PLAYER_STATUS.PLAYING;
  }

  isWon() {
    return this.status === PLAYER_STATUS.GAME_WON;
  }

  override toJSON(): PlayerJSON {
    return {
      ...super.toJSON(),
      status: this.status,
      city: this.city.toJSON(),
      killed: this.killed,
      index: this.index,
      name: this.name,
      roundLogs: this.roundLogs.map(log => log.toJSON())
    };
  }
}
