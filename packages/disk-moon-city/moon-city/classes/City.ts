import {
  DISTRIBUTION_DEFAULT_VALUES,
  DISTRIBUTION_MAX_VALUES,
  DISTRIBUTION_MIN_VALUES,
  DISTRIBUTION_TYPE
} from '../utils/city';

import { BUILDING, VEHICLE, WEAPON } from '../utils/types';
import AttackControl, { type AttackControlJSON } from './AttackControl';
import CityResident from './CityResident';
import Model, { type ModelJSON, type ModelOptions } from './Model';
import Storage, { StorageSlot, type StorageJSON } from './Storage';
import VehicleFactory from './buildings/VehicleFactory';
import WeaponFactory from './buildings/WeaponFactory';
import ServiceSecurity from './cityEmployees/ServiceSecurity';
import Soldier from './cityEmployees/Soldier';
import Mercenary from './cityEmployees/Mercenary';
import type { Observable } from 'rxjs';
import { lastValueFrom } from 'rxjs';

import {
  attackCityAttack,
  attackFactorySabotage,
  attackPowerStationSabotage,
  attackWeapon
} from '../observables/attacks/index';
import energyTransmitterDestroy from '../observables/attacks/energyTransmitterDestroy';
import damageVehicle from '../observables/attacks/damageVehicle';
import type Player from './Player';
import type Vehicle from './Vehicle';
import type Building from './Building';
import type Weapon from './Weapon';
import StorageHistoryEntry from './StorageHistoryEntry';
import { ATTACK_TYPE, RESOURCE_TYPE, type BUILDING_TYPE } from '../types';
import { STORAGE_TYPE } from '../types';
import type { WeaponJSON } from './Weapon';
import type { BuildingJSON } from './Building';
import type { VehicleJSON } from './Vehicle';

export interface CityOptions extends ModelOptions {
  storage?: Storage;
  vehicles?: Vehicle[];
  buildings?: Building[];
  weapons?: Weapon[];
  resident?: CityResident;
  securityService?: ServiceSecurity;
  soldier?: Soldier;
  mercenary?: Mercenary;
  distributionFood?: number;
  distributionEnergy?: number;
  taxes?: number;
  player: Player;
  attackControl?: AttackControl;
}

export interface CityJSON extends ModelJSON {
  storage: StorageJSON;
  attackControl: AttackControlJSON;
  vehicles: VehicleJSON[];
  buildings: BuildingJSON[];
  weapons: WeaponJSON[];
}

export default class City extends Model {
  player: Player;
  vehicles: Vehicle[] = [];
  buildings: Building[] = [];
  weapons: Weapon[] = [];
  storageHistory: StorageHistoryEntry[] = [];

  storage = new Storage({
    slots: [
      new StorageSlot({
        infinite: true,
        type: STORAGE_TYPE.CREDITS,
        value: 0
      }),
      new StorageSlot({ infinite: true, type: STORAGE_TYPE.ENERGY, value: 0 }),
      new StorageSlot({
        infinite: true,
        type: STORAGE_TYPE.HUMAN,
        value: 0
      }),
      new StorageSlot({ type: STORAGE_TYPE.EMPLOYEE, value: 0 }),
      new StorageSlot({ type: STORAGE_TYPE.MINERAL_ORE, value: 0 }),
      new StorageSlot({ type: STORAGE_TYPE.ENERGY_CELL, value: 0 }),
      new StorageSlot({ type: STORAGE_TYPE.FOOD, value: 0 }),
      new StorageSlot({ type: STORAGE_TYPE.SHIELD_ENERGY, value: 0 })
    ]
  });

  get recruitResidents() {
    console.warn('recruitResidents is not implemented');
    return this.resident.recruiting;
  }

  set recruitResidents(value) {
    console.warn('recruitResidents is not implemented');
    this.resident.recruiting = value;
  }

  attackControl: AttackControl = new AttackControl();

  /**
   * @description Gibt die Kosten für das Rekrutieren von Einwohnern zurück.
   */
  recruitResidentsCost = 300;

  resident = new CityResident();
  securityService = new ServiceSecurity();
  soldier = new Soldier();
  mercenary = new Mercenary();

  distributionFood: number =
    DISTRIBUTION_DEFAULT_VALUES[DISTRIBUTION_TYPE.FOOD];
  distributionEnergy: number =
    DISTRIBUTION_DEFAULT_VALUES[DISTRIBUTION_TYPE.ENERGY];
  taxes: number = DISTRIBUTION_DEFAULT_VALUES[DISTRIBUTION_TYPE.TAXES];

  constructor({
    id,
    storage,
    vehicles,
    buildings,
    weapons,
    resident,
    securityService,
    soldier,
    mercenary,
    distributionFood,
    distributionEnergy,
    taxes,
    player
  }: CityOptions) {
    super({ id });
    this.storage = new Storage(storage || this.storage);
    this.vehicles = (vehicles || this.vehicles).map(
      vehicle => new VEHICLE[vehicle.key]()
    );
    this.buildings = (buildings || this.buildings).map(
      building => new BUILDING[building.key]()
    );
    this.weapons = (weapons || this.weapons).map(
      weapon => new WEAPON[weapon.key]()
    );

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
    this.attackControl = new AttackControl();
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
   * @description Ruft den aktuellen Speicherplatz ab.
   */
  getStorageValue(type: STORAGE_TYPE) {
    return this.storage.get(type);
  }

  /**
   * @description Wird verwendet, um den Speicherplatz zu erweitern.
   */
  addStorageValue(type: STORAGE_TYPE, storage: number) {
    this.storage.set(
      type,
      Math.min(
        this.getStorageValue(type) + storage,
        this.storage.isInfinite(type) ? Infinity : this.getMaxStorageValue(type)
      )
    );
  }

  /**
   * @description Wird verwendet, um den Speicherplatz zu reduzieren.
   */
  subtractStorageValue(type: STORAGE_TYPE, storage: number) {
    return this.storage.set(
      type,
      Math.max(this.getStorageValue(type) - storage, 0)
    );
  }

  /**
   * @description Überprüft, ob der maximale Speicherplatz erreicht ist.
   */
  isMaxStorageValue(type: STORAGE_TYPE, value: number) {
    return (
      !this.storage.isInfinite(type) &&
      this.getStorageValue(type) + value > this.getMaxStorageValue(type)
    );
  }

  /**
   * @description Wird verwendet, um den Speicherplatz zu verändern.
   */
  setStorageValue(type: STORAGE_TYPE, value: number) {
    this.storageHistory.push(
      new StorageHistoryEntry({
        type,
        value: value - this.storage.get(type)
      })
    );

    this.storage.set(
      type,
      Math.max(
        Math.min(
          value,
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

  canBuyVehicle(vehicle: Vehicle) {
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

  buyVehicle(vehicle: Vehicle) {
    if (this.canBuyVehicle(vehicle)) {
      this.credits -= vehicle.price;
      this.vehicles = this.vehicles.concat(vehicle);
      return true;
    }
    return false;
  }

  sellVehicle(vehicle: Vehicle) {
    if (this.vehicles.includes(vehicle)) {
      this.credits += vehicle.sellPrice;
      this.removeVehicle(vehicle);
    }
  }

  removeVehicle(vehicle: Vehicle) {
    this.vehicles = this.vehicles.filter(({ id }) => vehicle.id !== id);
  }

  /**
   * @description Ruft die verfügbaren Fahrzeuge ab.
   */
  getAvailableVehicles() {
    return this.vehicles.filter(vehicle => vehicle.available);
  }

  //#endregion

  //#region building

  canBuyBuilding(building: Building) {
    if (building.price > this.credits) {
      throw new Error(ERROR_MESSAGE.NOT_ENOUGH_CREDITS);
    }
    return true;
  }

  buyBuilding(building: Building) {
    if (this.canBuyBuilding(building)) {
      this.credits -= building.price;
      this.buildings = this.buildings.concat(building);
      return true;
    }
    return false;
  }

  destroyBuilding(building: Building) {
    this.buildings = this.buildings.filter(({ id }) => building.id !== id);
  }

  sabotageBuilding(building: Building) {
    building.sabotaged = true;
  }

  sellBuilding(building: Building) {
    if (this.buildings.includes(building)) {
      this.credits += building.price;
      this.buildings = this.buildings.filter(({ id }) => building.id !== id);
    }
  }

  /**
   * @description Ruft die Gebäude nach Typ ab.
   */
  getBuildingsByType(type: BUILDING_TYPE) {
    return this.buildings.filter(building => {
      return (
        building.type.filter(buildingType => type === buildingType).length ===
        type.length
      );
    });
  }

  /**
   * @description Ruft die Gebäude nach Produktion ab.
   */
  getBuildingsByProduction(type: RESOURCE_TYPE) {
    return this.buildings.filter(building => type in building.roundProduction);
  }

  /**
   * @description Ruft die Gebäude nach Schlüssel ab.
   */
  getBuildingsByKey(key: string) {
    return this.buildings.filter(building => building.key === key);
  }

  /**
   * @description Ruft den maximalen Speicherplatz ab.
   */
  getMaxStorageValue(type: STORAGE_TYPE) {
    return this.buildings
      .filter(building => building.storage?.has(type))
      .reduce(
        /**
         * @param {Number} storage
         * @param {import("./Building").default} building
         */
        (storage, building) => {
          let value = 0;
          if (building.storage) {
            value = building.storage.get(type);
          }
          return storage + value;
        },
        0
      );
  }

  /**
   * @description Ruft den freien Speicherplatz ab.
   */
  getFreeStorageValue(type: STORAGE_TYPE) {
    if (this.storage.isInfinite(type)) {
      return Infinity;
    }
    return Math.max(
      this.getMaxStorageValue(type) - this.getStorageValue(type),
      0
    );
  }

  getDiffStorageValue(type: STORAGE_TYPE, value: number) {
    return Math.max(
      this.getStorageValue(type) + value - this.getMaxStorageValue(type),
      0
    );
  }
  //#endregion

  //#region weapon

  canBuyWeapon(weapon: Weapon) {
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

  buyWeapon(weapon: Weapon) {
    if (this.canBuyWeapon(weapon)) {
      this.credits -= weapon.price;
      this.weapons = this.weapons.concat(weapon);
      return true;
    }
    return false;
  }

  sellWeapon(weapon: Weapon) {
    if (this.weapons.includes(weapon)) {
      this.credits += weapon.price;
      this.weapons = this.weapons.filter(({ id }) => id !== weapon.id);
    }
  }

  useWeapon(weapon: Weapon) {
    this.weapons = this.weapons.filter(({ id }) => {
      return weapon.id !== id;
    });
  }

  /**
   * @description Ruft die Waffen nach Schlüssel ab.
   */
  getWeaponsByKey(key: string) {
    return this.weapons.filter(weapon => weapon.key === key);
  }

  canRepairVehicle(vehicle: Vehicle) {
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

  repairVehicle(vehicle: Vehicle) {
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

  setDistributionFood(distributionFood: number) {
    if (distributionFood < DISTRIBUTION_MIN_VALUES[DISTRIBUTION_TYPE.FOOD]) {
      throw new Error('Distribution food too low');
    }
    if (distributionFood > DISTRIBUTION_MAX_VALUES[DISTRIBUTION_TYPE.FOOD]) {
      throw new Error('Distribution food too high');
    }
    this.distributionFood = distributionFood;
  }

  setDistributionEnergy(distributionEnergy: number) {
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

  setTaxes(taxes: number) {
    if (taxes < DISTRIBUTION_MIN_VALUES[DISTRIBUTION_TYPE.TAXES]) {
      throw new Error('Taxes credits too low');
    }
    if (taxes > DISTRIBUTION_MAX_VALUES[DISTRIBUTION_TYPE.TAXES]) {
      throw new Error('Taxes credits too high');
    }
    this.taxes = taxes;
  }

  getProductionValue(type: RESOURCE_TYPE) {
    return this.buildings.reduce((production, building) => {
      return production + building.getProductionValue(type);
    }, 0);
  }

  getCostValue(type: RESOURCE_TYPE) {
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

  override toJSON(): CityJSON {
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

  async employeeAttack(type: ATTACK_TYPE, player: Player) {
    const attacks: Partial<{
      [key in ATTACK_TYPE]: ({
        city,
        player
      }: {
        city: City;
        player: Player;
      }) => Observable<void>;
    }> = {
      /**
       * Greift mit Soldaten Gebäude an.
       */
      [ATTACK_TYPE.ATTACK_CITY]: ({
        city,
        player
      }: {
        city: City;
        player: Player;
      }) => attackCityAttack(city, player),
      /**
       * Sabotiert mit Söldnern Produktionen.
       */
      [ATTACK_TYPE.FACTORY_SABOTAGE]: ({
        city,
        player
      }: {
        city: City;
        player: Player;
      }) => attackFactorySabotage(city, player),
      /**
       * Sabotiert mit Söldnern Fabriken und Kraftwerk.
       */
      [ATTACK_TYPE.POWER_STATION_SABOTAGE]: ({
        city,
        player
      }: {
        city: City;
        player: Player;
      }) => attackPowerStationSabotage(city, player),
      /**
       * Greift mit Söldnern Energieüberträger an.
       */
      [ATTACK_TYPE.DESTROY_ENERGY_TRANSMITTER]: ({
        city,
        player
      }: {
        city: City;
        player: Player;
      }) => energyTransmitterDestroy(city, player),
      /**
       * Greift mit Soldaten Fahrzeuge an.
       */
      [ATTACK_TYPE.DAMAGE_VEHICLE]: ({
        city,
        player
      }: {
        city: City;
        player: Player;
      }) => damageVehicle(city, player)
    };

    if (attacks[type]) {
      await lastValueFrom(attacks[type]({ city: this, player }));
    } else {
      throw new Error(`Attack type ${type} not found`);
    }

    return this.attackControl.setAttack(type, player);
  }

  /**
   * @description Wird aufgerufen, wenn ein Spieler angreift.
   */
  weaponAttack(player: Player, weapon: Weapon) {
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
