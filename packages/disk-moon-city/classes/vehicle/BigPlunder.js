import { VEHICLE_KEY } from '../../utils/keys';
import Harvester from './Harvester';
import RocketLauncher from '../vehicleWeapons/RocketLauncher';

export default class BigPlunder extends Harvester {
  constructor() {
    super({
      key: VEHICLE_KEY.BIG_PLUNDER,
      maxStorage: 8000,
      armor: 90,
      maxArmor: 90,
      weapon: new RocketLauncher(),
      price: 9920
    });
  }
}
