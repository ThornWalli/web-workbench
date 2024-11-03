import { VEHICLE_KEY } from '../../utils/keys';
import Harvester from './Harvester';
import None from '../vehicleWeapons/None';

export default class Shrimp extends Harvester {
  constructor() {
    super({
      key: VEHICLE_KEY.SHRIMP,
      maxStorage: 2000,
      armor: 20,
      maxArmor: 20,
      weapon: new None(),
      price: 920
    });
  }
}
