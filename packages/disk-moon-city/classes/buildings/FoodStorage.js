import { BUILDING_KEY, BUILDING_TYPE, STORAGE_TYPE } from '../../utils/keys';
import Building from '../Building';
import Storage, { StorageSlot } from '../Storage';

export default class FoodStorage extends Building {
  constructor() {
    super({
      type: [BUILDING_TYPE.RESOURCE, BUILDING_TYPE.STORAGE, BUILDING_TYPE.FOOD],
      key: BUILDING_KEY.FOOD_STORAGE,
      price: 920,
      roundCost: {
        energy: 0
      },

      storage: new Storage({
        slots: [new StorageSlot({ type: STORAGE_TYPE.FOOD, value: 16000 })]
      })
    });
  }
}
