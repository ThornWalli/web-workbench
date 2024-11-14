// import VehicleFactory from '../../classes/buildings/VehicleFactory.js';
// import WeaponFactory from '../../classes/buildings/WeaponFactory.js';
import Player from '../../classes/Player';
import Grabber from '../../classes/vehicles/Grabber.js';
import Thunder from '../../classes/vehicles/Thunder.js';
import Rocket from '../../classes/weapons/Rocket.js';
import SatelliteLaser from '../../classes/weapons/SatelliteLaser.js';
import SearchRocket from '../../classes/weapons/SearchRocket.js';
import { basicPlayerConfig } from '../../utils/player.js';

/**
 * @param {import('../../classes/Core.js').default} core
 */
export default function debug(core) {
  const player1 = new Player({ name: 'Player 1' });
  basicPlayerConfig(player1);

  const hasSecondPlayer = false;

  player1.credits = 100000;

  const city = player1.city;
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

  if (hasSecondPlayer) {
    const player2 = new Player({ name: 'Player 2' });

    // player2.credits = 100000;
    core.addPlayer(player2);
  }

  core.start();
}
