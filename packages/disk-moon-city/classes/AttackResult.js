import Model from './Model.js';

export default class AttackResult extends Model {
  /**
   * @type {import('../utils/keys.js').ATTACK_TYPE}
   */
  type;

  /**
   * @type {import('./Player.js').default}
   */
  fromPlayer;

  /**
   * @type {import('./Player.js').default}
   */
  toPlayer;

  /**
   * @type {AttackResultBuilding[]}
   */
  buildings = [];

  /**
   * @type {AttackResultVehicle[]}
   */
  vehicles = [];

  constructor({ type, fromPlayer, toPlayer, buildings, vehicles, ...options }) {
    super(options);
    this.type = type;
    this.fromPlayer = fromPlayer;
    this.toPlayer = toPlayer;
    this.buildings = buildings || this.buildings;
    this.vehicles = vehicles || this.vehicles;
  }

  isDefended(player) {
    return this.toPlayer === player;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
      fromPlayer: this.fromPlayer?.toJSON(),
      toPlayer: this.toPlayer?.toJSON(),
      buildings: this.buildings.map(building => building.toJSON()),
      vehicles: this.vehicles.map(vehicle => vehicle.toJSON())
    };
  }
}

export class AttackResultBuilding {
  /**
   * @type {String}
   */
  key;

  /**
   * Gebäude ist zerstört.
   * @type {Boolean}
   */
  destroyed = false;

  /**
   * Gebäude ist sabotiert.
   * @type {Boolean}
   */
  sabotaged = false;

  constructor({ key, destroyed, sabotaged }) {
    this.key = key;
    this.destroyed = destroyed;
    this.sabotaged = sabotaged;
  }

  toJSON() {
    return {
      key: this.key,
      destroyed: this.destroyed,
      sabotaged: this.sabotaged
    };
  }
}

export class AttackResultVehicle {
  /**
   * @type {String}
   */
  key;

  /**
   * Fahrzeug ist beschädigt.
   * @type {Boolean}
   */
  damaged = false;

  /**
   * Fahrzeug ist zerstört.
   * @type {Boolean}
   */
  destroyed = false;

  constructor({ key, damaged, destroyed }) {
    this.key = key;
    this.damaged = damaged;
    this.destroyed = destroyed;
  }

  toJSON() {
    return {
      key: this.key,
      damaged: this.damaged,
      destroyed: this.destroyed
    };
  }
}
