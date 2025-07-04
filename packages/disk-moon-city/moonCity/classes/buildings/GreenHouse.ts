import {
  BUILDING_KEY,
  BUILDING_TYPE,
  RESOURCE_TYPE,
  STORAGE_TYPE
} from '../../types';
import Building from '../Building';
import Storage, { StorageSlot } from '../Storage';

export default class GreenHouse extends Building {
  constructor() {
    super({
      type: [
        BUILDING_TYPE.FACTORY,
        BUILDING_TYPE.RESOURCE,
        BUILDING_TYPE.PRODUCTION,
        BUILDING_TYPE.FOOD
      ],
      key: BUILDING_KEY.GREEN_HOUSE,
      price: 320,
      storage: new Storage({
        slots: [new StorageSlot({ type: STORAGE_TYPE.FOOD, value: 2000 })]
      }),
      roundCost: {
        [RESOURCE_TYPE.ENERGY]: 100
      },
      roundProduction: {
        [RESOURCE_TYPE.FOOD]: 400
      }
    });
  }
}
