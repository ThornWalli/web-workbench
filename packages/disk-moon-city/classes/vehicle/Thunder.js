import { VEHICLE_KEY } from '../../utils/keys';
import Harvester from './Harvester';
import PlasmaCannon from '../vehicleWeapons/PlasmaCannon';

export default class Thunder extends Harvester {
  constructor() {
    super({
      key: VEHICLE_KEY.THUNDER,
      maxStorage: 6000,
      armor: 60,
      maxArmor: 60,
      weapon: new PlasmaCannon(),
      price: 7920
    });
  }
}
