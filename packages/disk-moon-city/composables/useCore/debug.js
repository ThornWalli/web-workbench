import House from '../../classes/buildings/House.js';
import OreStorage from '../../classes/buildings/OreStorage.js';
import PowerStation from '../../classes/buildings/PowerStation.js';
import VehicleFactory from '../../classes/buildings/VehicleFactory.js';
import Player from '../../classes/Player';
import Grabber from '../../classes/vehicles/Grabber.js';
import Thunder from '../../classes/vehicles/Thunder.js';

/**
 * @param {import('../../classes/Core.js').default} core
 */
export default function debug(core) {
  const player1 = new Player({ name: 'Player 1' });

  player1.credits = 100000;
  // requirements
  player1.city.buyBuilding(new House());

  const city = player1.city;
  city.buyBuilding(new PowerStation());
  city.buyBuilding(new VehicleFactory());
  city.buyBuilding(new OreStorage());

  city.buyVehicle(new Grabber());

  const vehicle1 = new Grabber();
  vehicle1.armor = 2;
  city.buyVehicle(vehicle1);

  const vehicle2 = new Thunder();
  city.buyVehicle(vehicle2);

  const vehicle3 = new Thunder();

  city.buyVehicle(vehicle3);
  // city.setStorageValue(BUILDING_KEY, 1000);

  core.addPlayer(player1);

  // const player2 = new Player({ name: 'Player 2' });

  // player2.credits = 100000;
  // core.addPlayer(player2);

  core.start();
}
