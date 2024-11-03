import { BUILDING_TYPE } from '../../utils/keys';
import Building from '../Building';

export default class Vault extends Building {
  constructor() {
    super({
      type: [BUILDING_TYPE.WEAPON, BUILDING_TYPE.VEHICLE, BUILDING_TYPE.BUNKER],
      key: 'vault',
      price: 420,
      roundCost: {
        energy: 0
      }
    });
  }
}
