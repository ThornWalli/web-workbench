import { VEHICLE_KEY } from '../../utils/keys';
import Harvester from './Harvester';
import Cannon from '../vehicleWeapons/Cannon';

export default class Hawk extends Harvester {
  constructor() {
    super({
      key: VEHICLE_KEY.HAWK,
      maxStorage: 6000,
      armor: 40,
      maxArmor: 40,
      weapon: new Cannon(),
      price: 5020
    });
  }
}
