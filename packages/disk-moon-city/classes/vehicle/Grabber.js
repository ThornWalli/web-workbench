import { VEHICLE_KEY } from '../../utils/keys';
import None from '../vehicleWeapons/None';
import Harvester from './Harvester';

export default class Grabber extends Harvester {
  constructor() {
    super({
      key: VEHICLE_KEY.GRABBER,
      maxStorage: 2000,
      armor: 10,
      maxArmor: 10,
      weapon: new None(),
      price: 720
    });
  }
}
