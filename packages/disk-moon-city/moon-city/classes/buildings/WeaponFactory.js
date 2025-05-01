import { BUILDING_KEY, BUILDING_TYPE, RESOURCE_TYPE } from '../../utils/keys';
import Building from '../Building';

export default class WeaponFactory extends Building {
  constructor() {
    super({
      type: [
        BUILDING_TYPE.INDUSTRIAL,
        BUILDING_TYPE.WEAPON,
        BUILDING_TYPE.PRODUCTION,
        BUILDING_TYPE.FACTORY
      ],
      key: BUILDING_KEY.WEAPON_FACTORY,
      price: 1520,
      roundCost: {
        [RESOURCE_TYPE.ENERGY]: 0
      }
    });
  }
}
