import type { ATTACK_TYPE } from '../types';
import Model, { type ModelJSON } from './Model';

import type Player from './Player';
import type { VehicleJSON } from './Vehicle';
import type Vehicle from './Vehicle';

export interface IAttackResult {
  type?: ATTACK_TYPE;
  fromPlayer: Player;
  toPlayer: Player;
  buildings?: AttackResultBuilding[];
  vehicles?: AttackResultVehicle[];
}

export interface AttackResultOptions {
  type: ATTACK_TYPE;
  fromPlayer: Player;
  toPlayer: Player;
  buildings?: AttackResultBuilding[];
  vehicles?: AttackResultVehicle[];
}

export interface AttackResultJSON extends ModelJSON {
  type: ATTACK_TYPE;
  fromPlayer: { id: string };
  toPlayer: { id: string };
  buildings: AttackResultBuildingJSON[];
  vehicles: AttackResultVehicleJSON[];
}

export default class AttackResult extends Model {
  type: ATTACK_TYPE;
  fromPlayer: Player;
  toPlayer: Player;
  buildings: AttackResultBuilding[] = [];
  vehicles: AttackResultVehicle[] = [];

  constructor({
    type,
    fromPlayer,
    toPlayer,
    buildings,
    vehicles,
    ...options
  }: AttackResultOptions) {
    super(options);
    this.type = type;
    this.fromPlayer = fromPlayer;
    this.toPlayer = toPlayer;
    this.buildings = buildings || this.buildings;
    this.vehicles = vehicles || this.vehicles;
  }

  isDefended(player: Player) {
    return this.toPlayer === player;
  }

  override toJSON(): AttackResultJSON {
    return {
      ...super.toJSON(),
      type: this.type,
      fromPlayer: { id: this.fromPlayer.id },
      toPlayer: { id: this.toPlayer.id },
      buildings: this.buildings.map(building => building.toJSON()),
      vehicles: this.vehicles.map(vehicle => vehicle.toJSON())
    };
  }
}

export interface AttackResultBuildingOptions {
  key: string;
  destroyed?: boolean;
  sabotaged?: boolean;
}

export interface AttackResultBuildingJSON {
  key: string;
  destroyed: boolean;
  sabotaged: boolean;
}

export interface IAttackResultBuilding {
  key: string;
  destroyed: boolean;
  sabotaged: boolean;
}
export class AttackResultBuilding implements IAttackResultBuilding {
  key: string;

  /**
   * @description Gebäude ist zerstört.
   */
  destroyed: boolean;

  /**
   * @description Gebäude ist sabotiert.
   */
  sabotaged: boolean;

  constructor({ key, destroyed, sabotaged }: AttackResultBuildingOptions) {
    this.key = key;
    this.destroyed = destroyed || false;
    this.sabotaged = sabotaged || false;
  }

  toJSON(): AttackResultBuildingJSON {
    return {
      key: this.key,
      destroyed: this.destroyed,
      sabotaged: this.sabotaged
    };
  }
}

export interface AttackResultVehicleOptions {
  id: string;
  key: string;
  damaged: boolean;
  destroyed: boolean;
  attackedFrom?: Vehicle;
}

export interface AttackResultVehicleJSON {
  id: string;
  key: string;
  damaged: boolean;
  destroyed: boolean;
  attackedFrom?: VehicleJSON;
}

export class AttackResultVehicle {
  id: string;
  key: string;

  /**
   * @description Fahrzeug ist beschädigt.
   */
  damaged = false;

  /**
   * @description Fahrzeug ist zerstört.
   */
  destroyed = false;
  attackedFrom?: Vehicle;

  constructor({
    id,
    key,
    damaged,
    destroyed,
    attackedFrom
  }: AttackResultVehicleOptions) {
    this.id = id;
    this.key = key;
    this.damaged = damaged;
    this.destroyed = destroyed;
    this.attackedFrom = attackedFrom;
  }

  toJSON(): AttackResultVehicleJSON {
    return {
      id: this.id,
      key: this.key,
      damaged: this.damaged,
      destroyed: this.destroyed,
      attackedFrom: this.attackedFrom?.toJSON()
    };
  }
}
