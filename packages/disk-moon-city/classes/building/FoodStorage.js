import { BUILDING_TYPE } from '../../utils/keys';
import Building from '../Building';

export default class FoodStorage extends Building {
  constructor() {
    super({
      type: [BUILDING_TYPE.RESOURCE, BUILDING_TYPE.STORAGE, BUILDING_TYPE.FOOD],
      key: 'food_storage',
      price: 920,
      roundCost: {
        energy: 0
      },

      storage: {
        food: 16000
      }
    });
  }
}
