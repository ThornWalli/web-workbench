import { VEHICLE_KEY } from '../../utils/keys';
import Harvester from './Harvester';
import Cannon from '../vehicleWeapons/Cannon';

export default class Spider extends Harvester {
  constructor() {
    super({
      key: VEHICLE_KEY.SPIDER,
      maxStorage: 4000,
      armor: 40,
      maxArmor: 40,
      weapon: new Cannon(),
      price: 4220
    });
  }
}
