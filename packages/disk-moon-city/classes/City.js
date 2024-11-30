/* eslint-disable complexity */
import {
  DISTRIBUTION_DEFAULT_VALUES,
  DISTRIBUTION_MAX_VALUES,
  DISTRIBUTION_MIN_VALUES,
  DISTRIBUTION_TYPE
} from '../utils/city.js';
import { ATTACK_TYPE, RESOURCE_TYPE, STORAGE_TYPE } from '../utils/keys.js';
import { BUILDING, VEHICLE, WEAPON } from '../utils/types.js';
import AttackControl from './AttackControl.js';
import CityResident from './CityResident.js';
import Model from './Model';
import Storage, { StorageSlot } from './Storage.js';
import VehicleFactory from './buildings/VehicleFactory.js';
import WeaponFactory from './buildings/WeaponFactory.js';
import ServiceSecurity from './cityEmployees/ServiceSecurity.js';
import Soldier from './cityEmployees/Soldier.js';
import Mercenary from './cityEmployees/Mercenary.js';
import { lastValueFrom } from 'rxjs';

import {
  attackCityAttack,
  attackFactorySabotage,
  attackPowerStationSabotage,
  attackWeapon
} from '../observables/attacks/index.js';
import energyTransmitterDestroy from '../observables/attacks/energyTransmitterDestroy.js';
import damageVehicle from '../observables/attacks/damageVehicle.js';

class StorageHistoryEntry {
  /**
   * @type {Number}
   */
  round;

  /**
   * @type {Number}
   */
  timestamp;

  /**
   * @type {STORAGE_TYPE}
   */
  type;

  /**
   * @type {Number}
   * @description The value that was added or subtracted.
   */
  value;

  constructor({ round, timestamp, type, value }) {
    this.round = round;
    this.timestamp = timestamp || Date.now();
    this.type = type;
    this.value = value;
  }

  toJSON() {
    return {
      round: this.round,
      timestamp: this.timestamp,
      type: this.type,
      value: this.value
    };
  }
}

export default class City extends Model {
  /**
   * @type {import("./Player.js").default}
   */
  player;

  /**
   * @type {import("./Vehicle.js").default[]}
   */
  vehicles = [];

  /**
   * @type {import("./Building.js").default[]}
   */
  buildings = [];

  /**
   * @type {import("./Weapon.js").default[]}
   */
  weapons = [];

  /**
   * @type {Array<StorageHistoryEntry>}
   */
  storageHistory = [];

  /**
   * @type {Storage}
   */
  storage = new Storage({
    slots: [
      new StorageSlot({
        infinite: true,
        type: STORAGE_TYPE.CREDITS,
        value: 12000
      }),
      new StorageSlot({ infinite: true, type: STORAGE_TYPE.ENERGY, value: 0 }),
      new StorageSlot({
        infinite: true,
        type: STORAGE_TYPE.HUMAN,
        value: 4000
      }),
      new StorageSlot({ type: STORAGE_TYPE.EMPLOYEE, value: 0 }),
      new StorageSlot({ type: STORAGE_TYPE.MINERAL_ORE, value: 0 }),
      new StorageSlot({ type: STORAGE_TYPE.ENERGY_CELL, value: 800 }),
      new StorageSlot({ type: STORAGE_TYPE.FOOD, value: 0 }),
      new StorageSlot({ type: STORAGE_TYPE.SHIELD_ENERGY, value: 0 })
    ]
  });

  /**
   * @type Boolean
   */
  get recruitResidents() {
    console.warn('recruitResidents is not implemented');
    return this.resident.recruiting;
  }

  set recruitResidents(value) {
    console.warn('recruitResidents is not implemented');
    this.resident.recruiting = value;
  }

  attackControl = new AttackControl();

  /**
   * Gibt die Kosten für das Rekrutieren von Einwohnern zurück.
   * @type {Number}
   */
  recruitResidentsCost = 300;

  resident = new CityResident();
  securityService = new ServiceSecurity();
  soldier = new Soldier();
  mercenary = new Mercenary();

  /**
   * @type Number
   */
  distributionFood = DISTRIBUTION_DEFAULT_VALUES[DISTRIBUTION_TYPE.FOOD];

  /**
   * @type Number
   */
  distributionEnergy = DISTRIBUTION_DEFAULT_VALUES[DISTRIBUTION_TYPE.ENERGY];

  /**
   * @type Number
   */
  taxes = DISTRIBUTION_DEFAULT_VALUES[DISTRIBUTION_TYPE.TAXES];

  constructor({
    id,
    storage,
    vehicles,
    buildings,
    weapons,
    trainings,
    resident,
    securityService,
    soldier,
    mercenary,
    distributionFood,
    distributionEnergy,
    taxes,
    player,
    attackControl
  } = {}) {
    super({ id });
    this.storage = new Storage(storage || this.storage);
    this.vehicles = (vehicles || this.vehicles).map(
      vehicle => new VEHICLE[vehicle.key](vehicle)
    );
    this.buildings = (buildings || this.buildings).map(
      building => new BUILDING[building.key](building)
    );
    this.weapons = (weapons || this.weapons).map(
      weapon => new WEAPON[weapon.key](weapon)
    );

    this.trainings = { ...this.trainings, ...(trainings || {}) };
    this.resident = new CityResident(resident || this.resident);
    this.securityService = new ServiceSecurity(
      securityService || this.securityService
    );
    this.soldier = new Soldier(soldier || this.soldier);
    this.mercenary = new Mercenary(mercenary || this.mercenary);
    this.distributionFood = distributionFood || this.distributionFood;
    this.distributionEnergy = distributionEnergy || this.distributionEnergy;
    this.taxes = taxes || this.taxes;
    this.player = player;
    this.attackControl = new AttackControl(attackControl || this.attackControl);
  }

  get population() {
    return this.getStorageValue(STORAGE_TYPE.HUMAN);
  }

  get credits() {
    return this.getStorageValue(STORAGE_TYPE.CREDITS);
  }

  set credits(value) {
    this.setStorageValue(STORAGE_TYPE.CREDITS, value);
  }

  //#region storaga

  /**
   * Ruft den aktuellen Speicherplatz ab.
   * @param {STORAGE_TYPE} type
   * @returns {Number}
   */
  getStorageValue(type) {
    return this.storage.get(type);
  }

  /**
   * Wird verwendet, um den Speicherplatz zu erweitern.
   * @param {STORAGE_TYPE} type
   * @param {Number} value
   * @returns {Number}
   */
  addStorageValue(type, storage) {
    this.storage.set(
      type,
      Math.min(
        this.getStorageValue(type) + storage,
        this.storage.isInfinite(type) ? Infinity : this.getMaxStorageValue(type)
      )
    );
  }

  /**
   * Wird verwendet, um den Speicherplatz zu reduzieren.
   * @param {STORAGE_TYPE} type
   * @param {Number} value
   * @returns {Number}
   */
  subtractStorageValue(type, storage) {
    return this.storage.set(
      type,
      Math.max(this.getStorageValue(type) - storage, 0)
    );
  }

  /**
   * Überprüft, ob der maximale Speicherplatz erreicht ist.
   * @param {STORAGE_TYPE} type
   * @param {Number} value
   * @returns {Boolean}
   */
  isMaxStorageValue(type, value) {
    return (
      !this.storage.isInfinite(type) &&
      this.getStorageValue(type) + value > this.getMaxStorageValue(type)
    );
  }

  /**
   * Wird verwendet, um den Speicherplatz zu verändern.
   * @param {STORAGE_TYPE} type
   * @param {Number} value
   * @returns {Number}
   */
  setStorageValue(type, storage) {
    this.storageHistory.push(
      new StorageHistoryEntry({
        type,
        value: storage - this.storage.get(type)
      })
    );

    this.storage.set(
      type,
      Math.max(
        Math.min(
          storage,
          this.storage.isInfinite(type)
            ? Infinity
            : this.getMaxStorageValue(type)
        ),
        0
      )
    );
  }

  //#endregion

  //#region vehicle

  /**
   * @param {import("./Vehicle.js").default} vehicle
   * @returns {Boolean}
   */
  canBuyVehicle(vehicle) {
    if (this.vehicles.length >= 4) {
      throw new Error(ERROR_MESSAGE.MAX_VEHICLES_REACHED);
    }
    if (
      this.buildings.filter(building => building instanceof VehicleFactory)
        .length < 1
    ) {
      throw new Error(ERROR_MESSAGE.NO_VEHICLE_FACTORY);
    }
    if (vehicle.price > this.credits) {
      throw new Error(ERROR_MESSAGE.NOT_ENOUGH_CREDITS);
    }
    return this.vehicles.length < 4;
  }

  /**
   *
   * @param {import("./Vehicle.js").default} vehicle
   * @returns {Boolean}
   */
  buyVehicle(vehicle) {
    if (this.canBuyVehicle(vehicle)) {
      this.credits -= vehicle.price;
      this.vehicles = this.vehicles.concat(vehicle);
      return true;
    }
    return false;
  }

  /**
   * @param {import("./Vehicle.js").default} vehicle
   */
  sellVehicle(vehicle) {
    if (this.vehicles.includes(vehicle)) {
      this.credits += vehicle.sellPrice;
      this.removeVehicle();
    }
  }

  /**
   * @param {import("./Vehicle.js").default} vehicle
   */
  removeVehicle(vehicle) {
    this.vehicles = this.vehicles.filter(({ id }) => vehicle.id !== id);
  }

  /**
   * Ruft die verfügbaren Fahrzeuge ab.
   * @returns {import("./Vehicle.js").default[]}
   */
  getAvailableVehicles() {
    return this.vehicles.filter(vehicle => vehicle.available);
  }

  //#endregion

  //#region building

  /**
   * @param {import("./Building.js").default} vehicle
   * @returns {Boolean}
   */
  canBuyBuilding(building) {
    if (building.price > this.credits) {
      throw new Error(ERROR_MESSAGE.NOT_ENOUGH_CREDITS);
    }
    return true;
  }

  /**
   * @param {import("./Building.js").default} building
   * @returns {Boolean}
   */
  buyBuilding(building) {
    if (this.canBuyBuilding(building)) {
      this.credits -= building.price;
      this.buildings = this.buildings.concat(building);
      return true;
    }
    return false;
  }

  /**
   * @param {import("./Building.js").default} building
   */
  destroyBuilding(building) {
    this.buildings = this.buildings.filter(({ id }) => building.id !== id);
  }

  /**
   * @param {import("./Building.js").default} building
   */
  sabotageBuilding(building) {
    building.sabotaged = true;
  }

  /**
   *
   * @param {import("./Building.js").default} vehicle
   */
  sellBuilding(building) {
    if (this.buildings.includes(building)) {
      this.credits += building.price;
      this.buildings = this.buildings.filter(({ id }) => building.id !== id);
    }
  }

  /**
   * Ruft die Gebäude nach Typ ab.
   * @param {BUILDING_TYPE} type
   * @returns {import("./Building.js").default[]}
   */
  getBuildingsByType(type) {
    type = [].concat(type);

    return this.buildings.filter(building => {
      return (
        building.type.filter(buildingType => type.includes(buildingType))
          .length === type.length
      );
    });
  }

  /**
   * Ruft die Gebäude nach Produktion ab.
   * @param {RESOURCE_TYPE} type
   * @returns {import("./Building.js").default[]}
   */
  getBuildingsByProduction(type) {
    return this.buildings.filter(building => type in building.roundProduction);
  }

  /**
   * Ruft die Gebäude nach Schlüssel ab.
   * @param {String} key
   * @returns {import("./Building.js").default[]}
   */
  getBuildingsByKey(key) {
    return this.buildings.filter(building => building.key === key);
  }

  /**
   * Ruft den maximalen Speicherplatz ab.
   * @param {STORAGE_TYPE} type
   */
  getMaxStorageValue(type) {
    return this.buildings
      .filter(building => building.storage?.has(type))
      .reduce(
        /**
         * @param {Number} storage
         * @param {import("./Building.js").default} building
         */
        (storage, building) => {
          return storage + building.storage.get(type);
        },
        0
      );
  }

  /**
   * Ruft den freien Speicherplatz ab.
   * @param {BUILDING_TYPE} type
   */
  getFreeStorageValue(type) {
    if (this.storage.isInfinite(type)) {
      return Infinity;
    }
    return Math.max(
      this.getMaxStorageValue(type) - this.getStorageValue(type),
      0
    );
  }

  getDiffStorageValue(type, value) {
    return Math.max(
      this.getStorageValue(type) + value - this.getMaxStorageValue(type),
      0
    );
  }
  //#endregion

  //#region weapon

  /**
   * @param {import("./Weapon.js").default} vehicle
   * @returns {Boolean}
   */
  canBuyWeapon(weapon) {
    if (
      this.buildings.filter(building => building instanceof WeaponFactory)
        .length < 1
    ) {
      throw new Error(ERROR_MESSAGE.NO_WEAPON_FACTORY);
    }
    if (weapon.price > this.credits) {
      throw new Error(ERROR_MESSAGE.NOT_ENOUGH_CREDITS);
    }
    return true;
  }

  /**
   *
   * @param {import("./Weapon.js").default} vehicle
   * @returns {Boolean}
   */
  buyWeapon(weapon) {
    if (this.canBuyWeapon(weapon)) {
      this.credits -= weapon.price;
      this.weapons = this.weapons.concat(weapon);
      return true;
    }
    return false;
  }

  /**
   *
   * @param {import("./Weapon.js").default} vehicle
   */
  sellWeapon(weapon) {
    if (this.weapons.includes(weapon)) {
      this.credits += weapon.price;
      this.weapons = this.weapons.filter(({ id }) => id !== weapon.id);
    }
  }

  useWeapon(weapon) {
    this.weapons = this.weapons.filter(({ id }) => {
      return weapon.id !== id;
    });
  }

  /**
   * Ruft die Waffen nach Schlüssel ab.
   * @param {String} key
   * @returns {import("./Weapon.js").default[]}
   */
  getWeaponsByKey(key) {
    return this.weapons.filter(weapon => weapon.key === key);
  }

  /**
   * @param {import("./Vehicle.js").default} vehicle
   * @returns {Boolean}
   */
  canRepairVehicle(vehicle) {
    if (!vehicle.needsRepair) {
      throw new Error(ERROR_MESSAGE.VEHICLE_IS_NOT_DAMAGED);
    }
    if (
      this.buildings.filter(building => building instanceof VehicleFactory)
        .length < 1
    ) {
      throw new Error(ERROR_MESSAGE.NO_VEHICLE_FACTORY);
    }
    if (vehicle.repairing) {
      throw new Error(ERROR_MESSAGE.VEHICLE_IS_ALREADY_REPAIRING);
    }
    if (vehicle.repairPrice > this.credits) {
      throw new Error(ERROR_MESSAGE.NOT_ENOUGH_CREDITS);
    }
    return true;
  }

  /**
   *
   * @param {import("./Vehicle.js").default} vehicle
   * @returns {Boolean}
   */
  repairVehicle(vehicle) {
    if (this.canRepairVehicle(vehicle)) {
      this.credits -= vehicle.repairPrice;
      vehicle.repair();
      return true;
    }
    return false;
  }

  //#endregion

  //#region recruit

  setRecruitResidents() {
    if (!this.resident.recruiting) {
      if (this.resident.recruitmentCosts > this.credits) {
        throw new Error(ERROR_MESSAGE.NOT_ENOUGH_CREDITS);
      }
      this.credits -= this.resident.recruitmentCosts;
      this.resident.setRecruiting();
      return true;
    }
    return false;
  }

  /**
   * Legt fest das beim Runden wechsel Sicherheitsdienst rekrutiert wird.
   * @returns {void}
   */
  setRecruitSecurityService() {
    if (!this.securityService.recruiting) {
      if (this.securityService.recruitmentCosts > this.credits) {
        throw new Error(ERROR_MESSAGE.NOT_ENOUGH_CREDITS);
      }
      if (this.getFreeStorageValue(STORAGE_TYPE.EMPLOYEE) < 1) {
        throw new Error(ERROR_MESSAGE.NOT_ENOUGH_BARRACKS);
      }
      this.credits -= this.securityService.recruitmentCosts;
      this.securityService.setRecruiting();
      return true;
    }
    return false;
  }

  /**
   * Legt fest das beim Runden wechsel Sicherheitsdienst trainiert wird.
   */
  setTrainingSecurityService() {
    if (!this.securityService.training) {
      if (this.securityService.trainingCosts > this.credits) {
        throw new Error(ERROR_MESSAGE.NOT_ENOUGH_CREDITS);
      } else if (this.securityService.value < 1) {
        throw new Error(ERROR_MESSAGE.NOT_ENOUGH_EMPLOYEES);
      }
      this.credits -= this.securityService.trainingCosts;
      this.securityService.setTraining();
      return true;
    }
    return false;
  }

  /**
   * Legt fest das beim Runden wechsel Soldaten rekrutiert werden
   */
  setRecruitSoldier() {
    if (!this.soldier.recruiting) {
      if (this.soldier.recruitmentCosts > this.credits) {
        throw new Error(ERROR_MESSAGE.NOT_ENOUGH_CREDITS);
      }
      if (this.getFreeStorageValue(STORAGE_TYPE.EMPLOYEE) < 1) {
        throw new Error(ERROR_MESSAGE.NOT_ENOUGH_BARRACKS);
      }
      this.credits -= this.soldier.recruitmentCosts;
      this.soldier.setRecruiting();
      return true;
    }
    return false;
  }

  /**
   * Legt fest das beim Runden wechsel Soldaten trainiert werden.
   */
  setTrainingSoldier() {
    if (!this.soldier.training) {
      if (this.soldier.trainingCosts > this.credits) {
        throw new Error(ERROR_MESSAGE.NOT_ENOUGH_CREDITS);
      } else if (this.soldier.value < 1) {
        throw new Error(ERROR_MESSAGE.NOT_ENOUGH_EMPLOYEES);
      }
      this.credits -= this.soldier.trainingCosts;
      this.soldier.setTraining();
      return true;
    }
    return false;
  }

  /**
   * Legt fest das beim Runden wechsel Söldner rekrutiert werden.
   */
  setRecruitMercenary() {
    if (!this.mercenary.recruiting) {
      if (this.mercenary.recruitmentCosts > this.credits) {
        throw new Error(ERROR_MESSAGE.NOT_ENOUGH_CREDITS);
      }
      if (this.getFreeStorageValue(STORAGE_TYPE.EMPLOYEE) < 1) {
        throw new Error(ERROR_MESSAGE.NOT_ENOUGH_BARRACKS);
      }
      this.credits -= this.mercenary.recruitmentCosts;
      this.mercenary.setRecruiting();
      return true;
    }
    return false;
  }

  /**
   * Legt fest das beim Runden wechsel Söldner trainiert werden.
   */
  setTrainingMercenary() {
    if (!this.mercenary.training) {
      if (this.mercenary.trainingCosts > this.credits) {
        throw new Error(ERROR_MESSAGE.NOT_ENOUGH_CREDITS);
      } else if (this.mercenary.value < 1) {
        throw new Error(ERROR_MESSAGE.NOT_ENOUGH_EMPLOYEES);
      }
      this.credits -= this.mercenary.trainingCosts;
      this.mercenary.setTraining();
      return true;
    }
    return false;
  }

  //#endregion

  setDistributionFood(distributionFood) {
    if (distributionFood < DISTRIBUTION_MIN_VALUES[DISTRIBUTION_TYPE.FOOD]) {
      throw new Error('Distribution food too low');
    }
    if (distributionFood > DISTRIBUTION_MAX_VALUES[DISTRIBUTION_TYPE.FOOD]) {
      throw new Error('Distribution food too high');
    }
    this.distributionFood = distributionFood;
  }

  setDistributionEnergy(distributionEnergy) {
    if (
      distributionEnergy < DISTRIBUTION_MIN_VALUES[DISTRIBUTION_TYPE.ENERGY]
    ) {
      throw new Error('Distribution energy too low');
    }
    if (
      distributionEnergy > DISTRIBUTION_MAX_VALUES[DISTRIBUTION_TYPE.ENERGY]
    ) {
      throw new Error('Distribution energy too high');
    }
    this.distributionEnergy = distributionEnergy;
  }

  setTaxes(taxes) {
    if (taxes < DISTRIBUTION_MIN_VALUES[DISTRIBUTION_TYPE.TAXES]) {
      throw new Error('Taxes credits too low');
    }
    if (taxes > DISTRIBUTION_MAX_VALUES[DISTRIBUTION_TYPE.TAXES]) {
      throw new Error('Taxes credits too high');
    }
    this.taxes = taxes;
  }

  /**
   * @param {import('../utils/keys.js').RESOURCE_TYPE} type
   * @returns {Number}
   */
  getProductionValue(type) {
    return this.buildings.reduce((production, building) => {
      return production + building.getProductionValue(type);
    }, 0);
  }
  /**
   * @param {import('../utils/keys.js').RESOURCE_TYPE} type
   * @returns {Number}
   */
  getCostValue(type) {
    return this.buildings.reduce(
      (result, building) => result + building.getCostValue(type),
      0
    );
  }

  getEnergy() {
    return this.getProductionValue(RESOURCE_TYPE.ENERGY);
  }

  getPopulationFood() {
    return Math.round((this.population * this.distributionFood) / 20);
  }

  getPopulationEnergy() {
    return Math.round((this.population * this.distributionEnergy) / 20);
  }

  getSizeIndex() {
    if (this.population >= 20000) {
      return 3;
    } else if (this.population >= 10000) {
      return 2;
    } else if (this.population >= 5000) {
      return 1;
    } else {
      return 0;
    }
  }

  toSnapshot() {
    return {
      ...super.toJSON(),
      storage: this.storage.toJSON(),
      vehicles: this.vehicles.map(vehicle => vehicle.toJSON()),
      buildings: this.buildings.map(building => building.toJSON()),
      weapons: this.weapons.map(weapon => weapon.toJSON())
    };
  }

  toJSON() {
    return {
      ...super.toJSON(),
      storage: this.storage.toJSON(),
      attackControl: this.attackControl.toJSON(),
      vehicles: this.vehicles.map(vehicle => vehicle.toJSON()),
      buildings: this.buildings.map(building => building.toJSON()),
      weapons: this.weapons.map(weapon => weapon.toJSON())
    };
  }

  //#region AttackControl

  /**
   * @param {import("../utils/keys").ATTACK_TYPE} type
   * @param {import("./Player.js").default} player Verteidiger
   * @returns {Promise<import('./attackResult/EmployeeAttackResult.js').default>}
   */
  async employeeAttack(type, player) {
    const attacks = {
      /**
       * Greift mit Soldaten Gebäude an.
       */
      [ATTACK_TYPE.ATTACK_CITY]: ({ city, player }) =>
        attackCityAttack(city, player),
      /**
       * Sabotiert mit Söldnern Produktionen.
       */
      [ATTACK_TYPE.FACTORY_SABOTAGE]: ({ city, player }) =>
        attackFactorySabotage(city, player),
      /**
       * Sabotiert mit Söldnern Fabriken und Kraftwerk.
       */
      [ATTACK_TYPE.POWER_STATION_SABOTAGE]: ({ city, player }) =>
        attackPowerStationSabotage(city, player),
      /**
       * Greift mit Söldnern Energieüberträger an.
       */
      [ATTACK_TYPE.DESTROY_ENERGY_TRANSMITTER]: ({ city, player }) =>
        energyTransmitterDestroy(city, player),
      /**
       * Greift mit Soldaten Fahrzeuge an.
       */
      [ATTACK_TYPE.DAMAGE_VEHICLE]: ({ city, player }) =>
        damageVehicle(city, player)
    };

    await lastValueFrom(attacks[String(type)]({ city: this, player }));

    return this.attackControl.setAttack(type, player);
  }

  /**
   * Wird aufgerufen, wenn ein Spieler angreift.
   * @param {import('./Player.js').default} player Angreifer
   * @param {import('./Weapon.js').default} weapon Waffe
   * @returns {Promise<import('./attackResult/WeaponAttackResult.js').default>}
   */
  weaponAttack(player, weapon) {
    return lastValueFrom(attackWeapon(this, player, weapon));
  }
  //#endregion
}

export const ERROR_MESSAGE = {
  MAX_VEHICLES_REACHED: 'Max vehicles reached',
  NO_VEHICLE_FACTORY: 'No vehicle factory',
  NO_WEAPON_FACTORY: 'No weapon factory',
  VEHICLE_IS_NOT_DAMAGED: 'Vehicle is not damaged',
  VEHICLE_IS_ALREADY_REPAIRING: 'Vehicle is already repairing',
  NOT_ENOUGH_CREDITS: 'Not enough credits',
  NOT_ENOUGH_EMPLOYEES: 'Not enough employees',
  NOT_ENOUGH_BARRACKS: 'Not enough barracks'
};
