import {
  BUILDING_KEY,
  BUILDING_TYPE,
  RESOURCE_TYPE,
  STORAGE_TYPE
} from '../../types';
import Building from '../Building';
import Storage, { StorageSlot } from '../Storage';

export default class OreStorage extends Building {
  constructor() {
    super({
      type: [BUILDING_TYPE.RESOURCE, BUILDING_TYPE.ORE, BUILDING_TYPE.STORAGE],
      key: BUILDING_KEY.ORE_STORAGE,
      price: 920,
      roundCost: {
        [RESOURCE_TYPE.ENERGY]: 0
      },
      storage: new Storage({
        slots: [
          new StorageSlot({ type: STORAGE_TYPE.MINERAL_ORE, value: 1600 })
        ]
      })
    });
  }
}
