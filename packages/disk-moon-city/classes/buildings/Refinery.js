import {
  BUILDING_KEY,
  BUILDING_TYPE,
  RESOURCE_TYPE,
  STORAGE_TYPE
} from '../../utils/keys';
import Building from '../Building';
import Storage, { StorageSlot } from '../Storage';

export default class Refinery extends Building {
  constructor() {
    super({
      type: [
        BUILDING_TYPE.RESOURCE,
        BUILDING_TYPE.REFINERY,
        BUILDING_TYPE.STORAGE,
        BUILDING_TYPE.ORE,
        BUILDING_TYPE.ENERGY_CELL
      ],
      key: BUILDING_KEY.REFINERY,
      price: 520,
      roundCost: {
        [STORAGE_TYPE.MINERAL_ORE]: 400
      },
      storage: new Storage({
        slots: [
          new StorageSlot({ type: STORAGE_TYPE.MINERAL_ORE, value: 1200 }),
          new StorageSlot({ type: STORAGE_TYPE.ENERGY_CELL, value: 0 })
        ]
      }),
      roundProduction: {
        [RESOURCE_TYPE.ENERGY_CELL]: 400
      }
    });
  }
}
