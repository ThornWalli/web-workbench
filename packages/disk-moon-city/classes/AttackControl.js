import { ATTACK_TYPE } from '../utils/keys';

export default class AttackControl {
  costs = {
    [ATTACK_TYPE.SPY]: 480,
    [ATTACK_TYPE.ATTACK_CITY]: 2660,
    [ATTACK_TYPE.FACTORY_SABOTAGE]: 4000,
    [ATTACK_TYPE.POWER_STATION_SABOTAGE]: 2740,
    [ATTACK_TYPE.DESTROY_ENERGY_TRANSMITTER]: 8900,
    [ATTACK_TYPE.DAMAGE_VEHICLE]: 2300
  };

  status = {
    [ATTACK_TYPE.SPY]: false,
    [ATTACK_TYPE.ATTACK_CITY]: false,
    [ATTACK_TYPE.FACTORY_SABOTAGE]: false,
    [ATTACK_TYPE.POWER_STATION_SABOTAGE]: false,
    [ATTACK_TYPE.DESTROY_ENERGY_TRANSMITTER]: false,
    [ATTACK_TYPE.DAMAGE_VEHICLE]: false
  };

  getTotalCosts() {
    console.log(this.status);
    return Object.entries(this.costs).reduce(
      (acc, [key, cost]) => acc + (this.status[String(key)] ? cost : 0),
      0
    );
  }

  getSpyCosts() {
    return this.costs.spy;
  }

  setSpy() {
    this.status.spy = true;
  }

  /**
   * @param {ATTACK_TYPE} type
   */
  isAttack(type) {
    return this.status[String(type)];
  }

  /**
   * @param {ATTACK_TYPE} type
   */
  getCosts(type) {
    return this.costs[String(type)];
  }

  /**
   * @param {ATTACK_TYPE} type
   */
  setAttack(type) {
    this.status[String(type)] = true;
  }

  toJSON() {
    return {};
  }
}
