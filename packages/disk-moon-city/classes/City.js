/* eslint-disable complexity */
import { RESOURCE_TYPE, STORAGE_TYPE, TRAINING_TYPE } from '../utils/keys.js';
import { BUILDING, VEHICLE, WEAPON } from '../utils/types.js';
import Model from './Model';
import Storage, { StorageSlot } from './Storage.js';
import VehicleFactory from './buildings/VehicleFactory.js';
import WeaponFactory from './buildings/WeaponFactory.js';

export default class City extends Model {
  static MIN_DISTRIBUTION_FOOD = 1;
  static MAX_DISTRIBUTION_FOOD = 99999;
  static MIN_DISTRIBUTION_ENERGY = 1;
  static MAX_DISTRIBUTION_ENERGY = 99999;
  static MIN_TAXES_CREDITS = 1;
  static MAX_TAXES_CREDITS = 9999;

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
   * @type {Storage}
   */
  storage = new Storage({
    slots: [
      new StorageSlot({ type: STORAGE_TYPE.ENERGY, value: 0 }),
      new StorageSlot({ type: STORAGE_TYPE.HUMANS, value: 400 }),
      new StorageSlot({ type: STORAGE_TYPE.MINERAL_ORE, value: 0 }),
      new StorageSlot({ type: STORAGE_TYPE.ENERGY_CELL, value: 800 }),
      new StorageSlot({ type: STORAGE_TYPE.FOOD, value: 0 }),
      new StorageSlot({ type: STORAGE_TYPE.SECURITY_SERVICE, value: 0 }),
      new StorageSlot({ type: STORAGE_TYPE.SOLDIER, value: 0 }),
      new StorageSlot({ type: STORAGE_TYPE.MERCENARY, value: 0 })
    ]
  });

  /**
   * @type {Object<TRAINING_TYPE, Number>}
   */
  trainings = {
    [TRAINING_TYPE.SECURITY_SERVICE]: 0,
    [TRAINING_TYPE.SOLDIER]: 0,
    [TRAINING_TYPE.MERCENARY]: 0
  };

  /**
   * @type Boolean
   */
  recruitResidents = false;

  /**
   * Sicherheits Dienst
   * @type Number
   */
  securityService = 0;

  /**
   * Anzahl der Soldaten
   * @type Number
   */
  soldiers = 0;

  /**
   * Anzahl der Söldner
   * @type Number
   */
  mercenary = 0;

  /**
   * @type Number
   */
  distributionFood = 4;

  /**
   * @type Number
   */
  distributionEnergy = 4;

  /**
   * @type Number
   */
  taxes = 50;

  constructor({
    id,
    storage,
    vehicles,
    buildings,
    weapons,
    trainings,
    recruitResidents,
    securityService,
    soldiers,
    mercenary,
    distributionFood,
    distributionEnergy,
    taxes
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
    this.recruitResidents = recruitResidents || this.recruitResidents;
    this.securityService = securityService || this.securityService;
    this.soldiers = soldiers || this.soldiers;
    this.mercenary = mercenary || this.mercenary;
    this.distributionFood = distributionFood || this.distributionFood;
    this.distributionEnergy = distributionEnergy || this.distributionEnergy;
    this.taxes = taxes || this.taxes;
  }

  get population() {
    return this.storage.get(STORAGE_TYPE.HUMANS);
  }

  //#region trainings

  /**
   * Ruft den aktuellen Trainingswert ab.
   * @param {TRAINING_TYPE} type
   * @returns {Number}
   */
  getTrainingValue(type) {
    if (!(type in this.trainings)) {
      throw new Error(`Invalid training type: ${type}`);
    }
    return this.trainings[String(type)];
  }

  //#endregion

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
  addStorageValue(type, storage, ignoreMax) {
    this.storage.set(
      type,
      Math.min(
        this.getStorageValue(type) + storage,
        ignoreMax ? Infinity : this.getMaxStorageValue(type)
      )
    );
  }

  /**
   * Überprüft, ob der maximale Speicherplatz erreicht ist.
   * @param {STORAGE_TYPE} type
   * @param {Number} value
   * @returns {Boolean}
   */
  isMaxStorageValue(type, value) {
    return this.getStorageValue(type) + value > this.getMaxStorageValue(type);
  }

  /**
   * Wird verwendet, um den Speicherplatz zu verändern.
   * @param {STORAGE_TYPE} type
   * @param {Number} value
   * @returns {Number}
   */
  setStorageValue(type, storage, ignoreMax) {
    this.storage.set(
      type,
      Math.min(storage, ignoreMax ? Infinity : this.getMaxStorageValue(type))
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
    if (vehicle.price > this.player.credits) {
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
      this.player.credits -= vehicle.price;
      this.vehicles = this.vehicles.concat(vehicle);
      return true;
    }
    return false;
  }

  /**
   *
   * @param {import("./Vehicle.js").default} vehicle
   */
  sellVehicle(vehicle) {
    if (this.vehicles.includes(vehicle)) {
      this.player.credits += vehicle.sellPrice;
      this.vehicles = this.vehicles.filter(({ id }) => vehicle.id !== id);
    }
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
    if (building.price > this.player.credits) {
      throw new Error(ERROR_MESSAGE.NOT_ENOUGH_CREDITS);
    }
    return true;
  }

  /**
   *
   * @param {import("./Building.js").default} vehicle
   * @returns {Boolean}
   */
  buyBuilding(building) {
    if (this.canBuyBuilding(building)) {
      this.player.credits -= building.price;
      this.buildings = this.buildings.concat(building);
      return true;
    }
    return false;
  }

  /**
   *
   * @param {import("./Building.js").default} vehicle
   */
  sellBuilding(building) {
    if (this.buildings.includes(building)) {
      this.player.credits += building.price;
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
    return Math.max(
      this.getMaxStorageValue(type) - this.getStorageValue(type),
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
    if (weapon.price > this.player.credits) {
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
      this.player.credits -= weapon.price;
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
      this.player.credits += weapon.price;
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
    if (vehicle.repairPrice > this.player.credits) {
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
      this.player.credits -= vehicle.repairPrice;
      vehicle.repair();
      return true;
    }
    return false;
  }

  //#endregion

  /**
   * Gibt die Kosten für das Rekrutieren von Einwohnern zurück.
   * @type {Number}
   */
  recruitResidentsCost = 300;
  setRecruitResidents() {
    if (!this.recruitResidents) {
      if (this.recruitResidentsCost > this.player.credits) {
        throw new Error(ERROR_MESSAGE.NOT_ENOUGH_CREDITS);
      }
      this.player.credits -= this.recruitResidentsCost;
      this.recruitResidentsCost += Math.round(this.population * 0.15);
      this.recruitResidents = true;
    }
  }

  setDistributionFood(distributionFood) {
    if (distributionFood < City.MIN_DISTRIBUTION_FOOD) {
      throw new Error('Taxes food too low');
    }
    if (distributionFood > City.MAX_DISTRIBUTION_FOOD) {
      throw new Error('Taxes food too high');
    }
    this.distributionFood = distributionFood;
  }

  setDistributionEnergy(distributionEnergy) {
    if (distributionEnergy < City.MIN_DISTRIBUTION_ENERGY) {
      throw new Error('Taxes energy too low');
    }
    if (distributionEnergy > City.MAX_DISTRIBUTION_ENERGY) {
      throw new Error('Taxes energy too high');
    }
    this.distributionEnergy = distributionEnergy;
  }

  setTaxes(taxes) {
    if (taxes < City.MIN_TAXES_CREDITS) {
      throw new Error('Taxes credits too low');
    }
    if (taxes > City.MAX_TAXES_CREDITS) {
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
    return this.buildings.reduce((production, building) => {
      return production + building.getCostValue(type);
    }, 0);
  }

  getEnergy() {
    return this.getProductionValue(RESOURCE_TYPE.ENERGY);
  }

  getPopulationFood() {
    return this.population * this.distributionFood;
  }

  getPopulationEnergy() {
    return this.population * this.distributionEnergy;
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
      storage: this.storage,
      vehicles: this.vehicles.map(vehicle => vehicle.toJSON()),
      buildings: this.buildings.map(building => building.toJSON()),
      weapons: this.weapons.map(weapon => weapon.toJSON())
    };
  }
}

export const ERROR_MESSAGE = {
  MAX_VEHICLES_REACHED: 'Max vehicles reached',
  NO_VEHICLE_FACTORY: 'No vehicle factory',
  NO_WEAPON_FACTORY: 'No weapon factory',
  VEHICLE_IS_NOT_DAMAGED: 'Vehicle is not damaged',
  VEHICLE_IS_ALREADY_REPAIRING: 'Vehicle is already repairing',
  NOT_ENOUGH_CREDITS: 'Not enough credits'
};
