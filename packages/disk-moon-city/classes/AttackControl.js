import { ATTACK_TYPE } from '../utils/keys';

export default class AttackControl {
  /**
   * @type {import('./AttackResult.js').default[]}
   */
  results = [];

  costs = {
    [ATTACK_TYPE.SPY]: 480,
    [ATTACK_TYPE.ATTACK_CITY]: 2660,
    [ATTACK_TYPE.FACTORY_SABOTAGE]: 4000,
    [ATTACK_TYPE.POWER_STATION_SABOTAGE]: 2740,
    [ATTACK_TYPE.DESTROY_ENERGY_TRANSMITTER]: 8900,
    [ATTACK_TYPE.DAMAGE_VEHICLE]: 2300
  };

  status = {
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
      this.status[String(key)] = [];
    });
  }

  /**
   *
   * @param {import('./AttackResult.js').default} result
   */
  addResult(result) {
    this.results.push(result);
  }

  /**
   *
   * @param {String>} type
   * @returns {import('./AttackResult.js').default[]}
   */
  extractResultByType(type) {
    type = [].concat(type);
    const { results, extract } = this.results.reduce(
      (result, value) => {
        if (type.includes(value.type)) {
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

  getResultByType(type) {
    type = [].concat(type);
    return this.results.filter(value => type.includes(value.type));
  }

  getTotalCosts(player) {
    return Object.entries(this.costs).reduce((acc, [key, cost]) => {
      return (
        acc +
        this.status[String(key)].filter(p => !player || p === player).length *
          cost
      );
    }, 0);
  }

  getSpyCosts() {
    return this.costs.spy;
  }

  /**
   * @param {ATTACK_TYPE} type
   */
  isAttack(type, player) {
    return !!this.status[String(type)].includes(player);
  }

  /**
   * @param {ATTACK_TYPE} type
   */
  getCosts(type) {
    return this.costs[String(type)];
  }

  /**
   * @param {ATTACK_TYPE} type
   * @param {import('../classes/Player.js').default} player Gegner
   */
  setAttack(type, player) {
    this.status[String(type)].push(player);
  }

  toJSON() {
    return {
      results: this.results.map(result => result.toJSON()),
      costs: this.costs,
      status: this.status
    };
  }
}
