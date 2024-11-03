import { BUILDING_KEY, VEHICLE_KEY, WEAPON_KEY } from './keys';

// vehicle
import Grabber from '../classes/vehicle/Grabber';
import Shrimp from '../classes/vehicle/Shrimp';
import Birdy from '../classes/vehicle/Birdy';
import Spider from '../classes/vehicle/Spider';
import Hawk from '../classes/vehicle/Hawk';
import Phantom from '../classes/vehicle/Phantom';
import Thunder from '../classes/vehicle/Thunder';
import BigPlunder from '../classes/vehicle/BigPlunder';

// building
import Barrack from '../classes/building/Barrack';
import Vault from '../classes/building/Vault';
import EnergyTransmitter from '../classes/building/EnergyTransmitter';
import FoodStorage from '../classes/building/FoodStorage';
import GreenHouse from '../classes/building/GreenHouse';
import House from '../classes/building/House';
import OreStorage from '../classes/building/OreStorage';
import PowerStation from '../classes/building/PowerStation';
import Refinery from '../classes/building/Refinery';
import ShieldGenerator from '../classes/building/ShieldGenerator';
import VehicleFactory from '../classes/building/VehicleFactory';
import WeaponFactory from '../classes/building/WeaponFactory';

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
  [BUILDING_KEY.BARRACKS]: Barrack,
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
