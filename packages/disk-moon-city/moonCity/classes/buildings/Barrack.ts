import {
  BUILDING_KEY,
  BUILDING_TYPE,
  RESOURCE_TYPE,
  STORAGE_TYPE
} from '../../types';
import Building from '../Building';
import Storage, { StorageSlot } from '../Storage';

export default class Barrack extends Building {
  constructor() {
    super({
      type: [
        BUILDING_TYPE.STORAGE,
        BUILDING_TYPE.SECURITY,
        BUILDING_TYPE.SOLDIER,
        BUILDING_TYPE.MERCENARY
      ],
      key: BUILDING_KEY.BARRACK,
      price: 620,
      roundCost: {
        [RESOURCE_TYPE.ENERGY]: 0,
        [RESOURCE_TYPE.FOOD]: 0
      },
      storage: new Storage({
        slots: [new StorageSlot({ type: STORAGE_TYPE.EMPLOYEE, value: 50 })]
      })
    });
  }
}
