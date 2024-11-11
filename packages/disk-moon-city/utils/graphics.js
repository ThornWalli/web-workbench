import { RECRUITMENT_TYPE, VEHICLE_KEY } from './keys.js';

import image_vehicle_birdy from '../assets/graphics/shop/vehicle/birdy.png';
import image_vehicle_big_plunder from '../assets/graphics/shop/vehicle/big_plunder.png';
import image_vehicle_grabber from '../assets/graphics/shop/vehicle/grabber.png';
import image_vehicle_hawk from '../assets/graphics/shop/vehicle/hawk.png';
import image_vehicle_phantom from '../assets/graphics/shop/vehicle/phantom.png';
import image_vehicle_shrimp from '../assets/graphics/shop/vehicle/shrimp.png';
import image_vehicle_spider from '../assets/graphics/shop/vehicle/spider.png';
import image_vehicle_thunder from '../assets/graphics/shop/vehicle/thunder.png';

import image_building_barrack from '../assets/graphics/shop/building/barrack.png';
import image_building_energy_transmitter from '../assets/graphics/shop/building/energy_transmitter.png';
import image_building_food_storage from '../assets/graphics/shop/building/food_storage.png';
import image_building_green_house from '../assets/graphics/shop/building/green_house.png';
import image_building_house from '../assets/graphics/shop/building/house.png';
import image_building_ore_storage from '../assets/graphics/shop/building/ore_storage.png';
import image_building_power_station from '../assets/graphics/shop/building/power_station.png';
import image_building_refinery from '../assets/graphics/shop/building/refinery.png';
import image_building_shield_generator from '../assets/graphics/shop/building/shield_generator.png';
import image_building_vault from '../assets/graphics/shop/building/vault.png';
import image_building_vehicle_factory from '../assets/graphics/shop/building/vehicle_factory.png';
import image_building_weapon_factory from '../assets/graphics/shop/building/weapon_factory.png';

import image_weapon_rocket from '../assets/graphics/shop/weapon/rocket.png';
import image_weapon_satellite_laser from '../assets/graphics/shop/weapon/satellite_laser.png';
import image_weapon_search_rocket from '../assets/graphics/shop/weapon/search_rocket.png';

import image_background_big_plunder from '../assets/graphics/background/vehicle/big_plunder.png';
import image_background_birdy from '../assets/graphics/background/vehicle/birdy.png';
import image_background_grabber from '../assets/graphics/background/vehicle/grabber.png';
import image_background_hawk from '../assets/graphics/background/vehicle/hawk.png';
import image_background_phantom from '../assets/graphics/background/vehicle/phantom.png';
import image_background_shrimp from '../assets/graphics/background/vehicle/shrimp.png';
import image_background_spider from '../assets/graphics/background/vehicle/spider.png';
import image_background_thunder from '../assets/graphics/background/vehicle/thunder.png';

import image_background_city_1 from '../assets/graphics/background/city/1.png';
import image_background_city_2 from '../assets/graphics/background/city/2.png';
import image_background_city_3 from '../assets/graphics/background/city/3.png';
import image_background_city_4 from '../assets/graphics/background/city/4.png';

import image_attack_recruitment_security_service from '../assets/graphics/attack/recruitment/item/security_service.png';
import image_attack_recruitment_soldier from '../assets/graphics/attack/recruitment/item/soldier.png';
import image_attack_recruitment_mercenary from '../assets/graphics/attack/recruitment/item/mercenary.png';

export default {
  background: {
    city: {
      size_1: image_background_city_1,
      size_2: image_background_city_2,
      size_3: image_background_city_3,
      size_4: image_background_city_4
    },
    vehicle: {
      [VEHICLE_KEY.BIG_PLUNDER]: image_background_big_plunder,
      [VEHICLE_KEY.BIRDY]: image_background_birdy,
      [VEHICLE_KEY.GRABBER]: image_background_grabber,
      [VEHICLE_KEY.HAWK]: image_background_hawk,
      [VEHICLE_KEY.PHANTOM]: image_background_phantom,
      [VEHICLE_KEY.SHRIMP]: image_background_shrimp,
      [VEHICLE_KEY.SPIDER]: image_background_spider,
      [VEHICLE_KEY.THUNDER]: image_background_thunder
    }
  },

  attack: {
    recruitment: {
      [RECRUITMENT_TYPE.SECURITY_SERVICE]:
        image_attack_recruitment_security_service,
      [RECRUITMENT_TYPE.SOLDIER]: image_attack_recruitment_soldier,
      [RECRUITMENT_TYPE.MERCENARY]: image_attack_recruitment_mercenary
    }
  },

  shop: {
    vehicle: {
      [VEHICLE_KEY.BIRDY]: image_vehicle_birdy,
      [VEHICLE_KEY.BIG_PLUNDER]: image_vehicle_big_plunder,
      [VEHICLE_KEY.GRABBER]: image_vehicle_grabber,
      [VEHICLE_KEY.HAWK]: image_vehicle_hawk,
      [VEHICLE_KEY.PHANTOM]: image_vehicle_phantom,
      [VEHICLE_KEY.SHRIMP]: image_vehicle_shrimp,
      [VEHICLE_KEY.SPIDER]: image_vehicle_spider,
      [VEHICLE_KEY.THUNDER]: image_vehicle_thunder
    },
    building: {
      barrack: image_building_barrack,
      energy_transmitter: image_building_energy_transmitter,
      food_storage: image_building_food_storage,
      green_house: image_building_green_house,
      house: image_building_house,
      ore_storage: image_building_ore_storage,
      power_station: image_building_power_station,
      refinery: image_building_refinery,
      shield_generator: image_building_shield_generator,
      vault: image_building_vault,
      vehicle_factory: image_building_vehicle_factory,
      weapon_factory: image_building_weapon_factory
    },
    weapon: {
      rocket: image_weapon_rocket,
      satellite_laser: image_weapon_satellite_laser,
      search_rocket: image_weapon_search_rocket
    }
  }
};
