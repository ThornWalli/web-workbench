import { VEHICLE_KEY } from '../../utils/keys';
import Harvester from './Harvester';
import LaserCannon from '../vehicleWeapons/LaserCannon';

export default class Phantom extends Harvester {
  constructor() {
    super({
      key: VEHICLE_KEY.PHANTOM,
      maxStorage: 6000,
      armor: 60,
      maxArmor: 60,
      weapon: new LaserCannon(),
      price: 7920
    });
  }
}
