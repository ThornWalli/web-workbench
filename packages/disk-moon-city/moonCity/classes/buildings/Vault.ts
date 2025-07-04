import { BUILDING_KEY, BUILDING_TYPE, RESOURCE_TYPE } from '../../types';
import Building from '../Building';

export default class Vault extends Building {
  constructor() {
    super({
      type: [BUILDING_TYPE.WEAPON, BUILDING_TYPE.VEHICLE, BUILDING_TYPE.BUNKER],
      key: BUILDING_KEY.VAULT,
      price: 420,
      roundCost: {
        [RESOURCE_TYPE.ENERGY]: 0
      }
    });
  }
}
