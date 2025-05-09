// import VehicleFactory from '../../classes/buildings/VehicleFactory';
// import WeaponFactory from '../../classes/buildings/WeaponFactory';
import Barrack from './classes/buildings/Barrack';
import EnergyTransmitter from './classes/buildings/EnergyTransmitter';
import GreenHouse from './classes/buildings/GreenHouse';
import House from './classes/buildings/House';
import OreStorage from './classes/buildings/OreStorage';
import PowerStation from './classes/buildings/PowerStation';
import Refinery from './classes/buildings/Refinery';
import ShieldGenerator from './classes/buildings/ShieldGenerator';
import Mercenary from './classes/cityEmployees/Mercenary';
import ServiceSecurity from './classes/cityEmployees/ServiceSecurity';
import Soldier from './classes/cityEmployees/Soldier';
import type Core from './classes/Core';
import Grabber from './classes/vehicles/Grabber';
import Thunder from './classes/vehicles/Thunder';
import Rocket from './classes/weapons/Rocket';
import SatelliteLaser from './classes/weapons/SatelliteLaser';
import SearchRocket from './classes/weapons/SearchRocket';
// import { ATTACK_TYPE } from './types';
import { basicPlayerConfig } from './utils/player';

export default async function dummyContent(core: Core) {
  const player1 = core.createPlayer('Player 1');
  basicPlayerConfig(player1);

  const hasMorePlayer = true;

  const city = player1.city;
  // player1.city.credits = 100000;

  // city.setTaxes(1);

  city.soldier = new Soldier({ value: 50, trained: 50 });
  city.mercenary = new Mercenary({ value: 50, trained: 25 });
  city.buildings.push(new Barrack());
  city.setRecruitSecurityService();
  city.setRecruitSoldier();
  city.setRecruitMercenary();

  // city.buildings.push(new WeaponFactory());
  // city.buildings.push(new VehicleFactory());

  city.weapons.push(
    ...Array(10)
      .fill(undefined)
      .map(() => new Rocket())
  );
  city.weapons.push(
    ...Array(10)
      .fill(undefined)
      .map(() => new SearchRocket())
  );
  city.weapons.push(
    ...Array(10)
      .fill(undefined)
      .map(() => new SatelliteLaser())
  );

  const vehicle1 = new Grabber();
  vehicle1.armor = 2;
  city.vehicles.push(vehicle1);

  const vehicle2 = new Thunder();
  city.vehicles.push(vehicle2);

  const vehicle3 = new Thunder();

  city.vehicles.push(vehicle3);
  // city.setStorageValue(BUILDING_KEY, 1000);

  if (hasMorePlayer) {
    // player2.credits = 100000;
    const player2 = core.createPlayer('Player 2');
    player2.city.securityService = new ServiceSecurity({ value: 16 });
    basicPlayerConfig(player2, [
      new OreStorage(),
      new Refinery(),
      new PowerStation(),
      new EnergyTransmitter(),
      ...Array(10)
        .fill(undefined)
        .map(() => new House()),
      new GreenHouse(),
      new GreenHouse(),
      new ShieldGenerator()
      // new ShieldGenerator(),
      // new ShieldGenerator()
    ]);
    // player.city.vehicles.push(new Grabber());

    // const player3 = new Player({ name: 'Player 3' });
    // core.addPlayer(player3);

    // await player1.city.employeeAttack(ATTACK_TYPE.ATTACK_CITY, player2);
    // await player1.city.employeeAttack(ATTACK_TYPE.FACTORY_SABOTAGE, player2);
    // await player1.city.employeeAttack(
    //   ATTACK_TYPE.POWER_STATION_SABOTAGE,
    //   player2
    // );
    // await player1.city.employeeAttack(
    //   ATTACK_TYPE.DESTROY_ENERGY_TRANSMITTER,
    //   player2
    // );
    // await player1.city.employeeAttack(ATTACK_TYPE.DAMAGE_VEHICLE, player2);
  }

  core.start();
}
