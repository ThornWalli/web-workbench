import { BUILDING_KEY, VEHICLE_KEY, WEAPON_KEY } from '../types';

// vehicle
import Grabber from '../classes/vehicles/Grabber';
import Shrimp from '../classes/vehicles/Shrimp';
import Birdy from '../classes/vehicles/Birdy';
import Spider from '../classes/vehicles/Spider';
import Hawk from '../classes/vehicles/Hawk';
import Phantom from '../classes/vehicles/Phantom';
import Thunder from '../classes/vehicles/Thunder';
import BigPlunder from '../classes/vehicles/BigPlunder';

// building
import Barrack from '../classes/buildings/Barrack';
import Vault from '../classes/buildings/Vault';
import EnergyTransmitter from '../classes/buildings/EnergyTransmitter';
import FoodStorage from '../classes/buildings/FoodStorage';
import GreenHouse from '../classes/buildings/GreenHouse';
import House from '../classes/buildings/House';
import OreStorage from '../classes/buildings/OreStorage';
import PowerStation from '../classes/buildings/PowerStation';
import Refinery from '../classes/buildings/Refinery';
import ShieldGenerator from '../classes/buildings/ShieldGenerator';
import VehicleFactory from '../classes/buildings/VehicleFactory';
import WeaponFactory from '../classes/buildings/WeaponFactory';

// weapon
import Rocket from '../classes/weapons/Rocket';
import SatelliteLaser from '../classes/weapons/SatelliteLaser';
import SearchRocket from '../classes/weapons/SearchRocket';

export const VEHICLE = {
  [VEHICLE_KEY.GRABBER]: Grabber,
  [VEHICLE_KEY.SHRIMP]: Shrimp,
  [VEHICLE_KEY.BIRDY]: Birdy,
  [VEHICLE_KEY.SPIDER]: Spider,
  [VEHICLE_KEY.HAWK]: Hawk,
  [VEHICLE_KEY.PHANTOM]: Phantom,
  [VEHICLE_KEY.THUNDER]: Thunder,
  [VEHICLE_KEY.BIG_PLUNDER]: BigPlunder
};

export const BUILDING = {
  [BUILDING_KEY.BARRACK]: Barrack,
  [BUILDING_KEY.VAULT]: Vault,
  [BUILDING_KEY.ENERGY_TRANSMITTER]: EnergyTransmitter,
  [BUILDING_KEY.FOOD_STORAGE]: FoodStorage,
  [BUILDING_KEY.GREEN_HOUSE]: GreenHouse,
  [BUILDING_KEY.HOUSE]: House,
  [BUILDING_KEY.ORE_STORAGE]: OreStorage,
  [BUILDING_KEY.POWER_STATION]: PowerStation,
  [BUILDING_KEY.REFINERY]: Refinery,
  [BUILDING_KEY.SHIELD_GENERATOR]: ShieldGenerator,
  [BUILDING_KEY.VEHICLE_FACTORY]: VehicleFactory,
  [BUILDING_KEY.WEAPON_FACTORY]: WeaponFactory
};

export const WEAPON = {
  [WEAPON_KEY.ROCKET]: Rocket,
  [WEAPON_KEY.SATELLITE_LASER]: SatelliteLaser,
  [WEAPON_KEY.SEARCH_ROCKET]: SearchRocket
};
