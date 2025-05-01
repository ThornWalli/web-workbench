// import VehicleFactory from '../../classes/buildings/VehicleFactory.js';
// import WeaponFactory from '../../classes/buildings/WeaponFactory.js';
import Barrack from './classes/buildings/Barrack.js';
import EnergyTransmitter from './classes/buildings/EnergyTransmitter.js';
import GreenHouse from './classes/buildings/GreenHouse.js';
import House from './classes/buildings/House.js';
import OreStorage from './classes/buildings/OreStorage.js';
import PowerStation from './classes/buildings/PowerStation.js';
import Refinery from './classes/buildings/Refinery.js';
import ShieldGenerator from './classes/buildings/ShieldGenerator.js';
import Mercenary from './classes/cityEmployees/Mercenary.js';
import ServiceSecurity from './classes/cityEmployees/ServiceSecurity.js';
import Soldier from './classes/cityEmployees/Soldier.js';
import Player from './classes/Player.js';
import Grabber from './classes/vehicles/Grabber.js';
import Thunder from './classes/vehicles/Thunder.js';
import Rocket from './classes/weapons/Rocket.js';
import SatelliteLaser from './classes/weapons/SatelliteLaser.js';
import SearchRocket from './classes/weapons/SearchRocket.js';
// import { ATTACK_TYPE } from './utils/keys.js';
import { basicPlayerConfig } from './utils/player.js';

/**
 * @param {import('./classes/Core.js').default} core
 */
export default async function dummyContent(core) {
  const player1 = new Player({ name: 'Player 1' });
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
      .fill()
      .map(() => new Rocket())
  );
  city.weapons.push(
    ...Array(10)
      .fill()
      .map(() => new SearchRocket())
  );
  city.weapons.push(
    ...Array(10)
      .fill()
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

  core.addPlayer(player1);

  if (hasMorePlayer) {
    const player2 = new Player({ name: 'Player 2' });

    // player2.credits = 100000;
    core.addPlayer(player2);
    player2.city.securityService = new ServiceSecurity({ value: 16 });
    basicPlayerConfig(player2, [
      new OreStorage(),
      new Refinery(),
      new PowerStation(),
      new EnergyTransmitter(),
      ...Array(10)
        .fill()
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
