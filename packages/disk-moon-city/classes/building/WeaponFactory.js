import { BUILDING_TYPE } from '../../utils/keys';
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
      key: 'weapon_factory',
      price: 1520,
      roundCost: {
        energy: 0
      }
    });
  }
}
