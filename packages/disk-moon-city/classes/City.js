import { BUILDING_TYPE, STORAGE_TYPE } from '../utils/keys.js';
import Model from './Model';
import VehicleFactory from './building/VehicleFactory.js';
import WeaponFactory from './building/WeaponFactory.js';

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

  storage = {
    [STORAGE_TYPE.HUMANS]: 400,
    [STORAGE_TYPE.MINERAL_ORE]: 0
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

  /**
   * @type {Object.<BUILDING_TYPE, Number>}
   */
  resources = {
    [BUILDING_TYPE.ORE]: 0,
    [BUILDING_TYPE.FOOD]: 0
  };

  constructor({ id, storage, vehicles, buildings, weapons } = {}) {
    super({ id });
    this.storage = storage || this.storage;
    this.vehicles = vehicles || this.vehicles;
    this.buildings = buildings || this.buildings;
    this.weapons = weapons || this.weapons;
  }

  get population() {
    return this.storage[STORAGE_TYPE.HUMANS];
  }

  //#region resource

  /**
   * Ruft den aktuellen Speicherplatz ab.
   * @param {STORAGE_TYPE} type
   * @returns {Number}
   */
  getStorageValue(type) {
    if (!(type in this.storage)) {
      console.error(type);
      throw new Error(`Invalid storage type: ${type}`);
    }
    return this.storage[String(type)];
  }

  /**
   * Wird verwendet um die Resource werte festzulegen.
   * @param {STORAGE_TYPE} type
   * @param {Number} value
   * @returns {Number}
   */
  setStorageValue(type, storage) {
    this.storage[String(type)] = Math.min(
      this.getStorageValue(type) + storage,
      this.getMaxStorageValue(type)
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
      this.player.credits += vehicle.price * (vehicle.armor / vehicle.maxArmor);
      this.vehicles = this.vehicles.filter(({ id }) => vehicle.id !== id);
    }
  }

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
   * Ruft den maximalen Speicherplatz ab.
   * @param {STORAGE_TYPE} type
   */
  getMaxStorageValue(type) {
    return this.getBuildingsByType(['storage'])
      .filter(
        /**
         * @param {import("./building/Storage.js").default} building
         */
        building => building.storageTypes.includes(type)
      )

      .reduce(
        /**
         * @param {Number} storage
         * @param {import("./building/Storage.js").default} building
         */
        (storage, building) => {
          return storage + building.storage;
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

  /**
   * @param {import("./Vehicle.js").default} vehicle
   * @returns {Boolean}
   */
  canRepairVehicle(vehicle) {
    if (!vehicle.needsRepair) {
      throw new Error(ERROR_MESSAGE.VEHICLE_IS_NOT_DAMAGED);
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
   * Ruft die aktuellen Kosten zum anwerben von Einwohnern ab.
   */
  getRecruitResidentsCost() {
    return parseInt(this.population / 10);
  }

  setRecruitResidents() {
    if (!this.recruitResidents) {
      if (this.getRecruitResidentsCost() > this.player.credits) {
        throw new Error(ERROR_MESSAGE.NOT_ENOUGH_CREDITS);
      }
      this.player.credits -= this.getRecruitResidentsCost();
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
