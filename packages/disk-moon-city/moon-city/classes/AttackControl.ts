import { ATTACK_TYPE } from '../types';
import type { AttackResultJSON } from './AttackResult';
import type AttackResult from './AttackResult';
import type Player from './Player';

export type Costs = {
  [key in ATTACK_TYPE]: number;
};

export type Status = {
  [key in ATTACK_TYPE]: Player[];
};

export interface AttackControlJSON {
  results: AttackResultJSON[];
  costs: Partial<Costs>;
  status: Partial<Status>;
}

export default class AttackControl {
  results: AttackResult[] = [];

  costs: Partial<{
    [key in ATTACK_TYPE]: number;
  }> = {
    [ATTACK_TYPE.SPY]: 480,
    [ATTACK_TYPE.ATTACK_CITY]: 2660,
    [ATTACK_TYPE.FACTORY_SABOTAGE]: 4000,
    [ATTACK_TYPE.POWER_STATION_SABOTAGE]: 2740,
    [ATTACK_TYPE.DESTROY_ENERGY_TRANSMITTER]: 8900,
    [ATTACK_TYPE.DAMAGE_VEHICLE]: 2300
  };

  status: Partial<{
    [key in ATTACK_TYPE]: Player[];
  }> = {
    [ATTACK_TYPE.SPY]: [],
    [ATTACK_TYPE.ATTACK_CITY]: [],
    [ATTACK_TYPE.FACTORY_SABOTAGE]: [],
    [ATTACK_TYPE.POWER_STATION_SABOTAGE]: [],
    [ATTACK_TYPE.DESTROY_ENERGY_TRANSMITTER]: [],
    [ATTACK_TYPE.DAMAGE_VEHICLE]: []
  };

  reset() {
    this.results = [];
    Object.keys(this.status).forEach(key => {
      this.status[key as ATTACK_TYPE] = [];
    });
  }

  addResult(result: AttackResult) {
    this.results.push(result);
  }

  extractResultByType(type: string) {
    const { results, extract } = this.results.reduce<{
      results: AttackResult[];
      extract: AttackResult[];
    }>(
      (result, value) => {
        if (type === value.type) {
          result.extract.push(value);
        } else {
          result.results.push(value);
        }
        return result;
      },
      {
        extract: [],
        results: []
      }
    );
    this.results = results;
    return extract;
  }

  getResultByType(type: ATTACK_TYPE | ATTACK_TYPE[]) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    return this.results.filter(value => type.includes(value.type));
  }

  getTotalCosts(player: Player) {
    return Object.entries(this.costs).reduce((acc, [key, cost]) => {
      const length =
        this.status[key as ATTACK_TYPE]?.filter(p => !player || p === player)
          .length || 0;
      return acc + length * cost;
    }, 0);
  }

  getSpyCosts() {
    return this.costs.spy;
  }

  isAttack(type: ATTACK_TYPE, player: Player) {
    return !!this.status[type]?.includes(player);
  }

  /**
   * @param {ATTACK_TYPE} type
   */
  getCosts(type: ATTACK_TYPE) {
    return this.costs[type];
  }

  /**
   * @param {ATTACK_TYPE} type
   * @param {import('../classes/Player').default} player Gegner
   */
  setAttack(type: ATTACK_TYPE, player: Player) {
    if (!this.status[type]) {
      throw new Error(`Attack type ${type} is not defined`);
    }
    this.status[type].push(player);
  }

  toJSON(): AttackControlJSON {
    return {
      results: this.results.map(result => result.toJSON()),
      costs: this.costs,
      status: this.status
    };
  }
}
