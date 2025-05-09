import {
  BUILDING_KEY,
  BUILDING_TYPE,
  RESOURCE_TYPE,
  STORAGE_TYPE
} from '../../types';
import Building from '../Building';
import Storage, { StorageSlot } from '../Storage';

export default class PowerStation extends Building {
  constructor() {
    super({
      type: [
        BUILDING_TYPE.RESOURCE,
        BUILDING_TYPE.POWER_STATION,
        BUILDING_TYPE.STORAGE,
        BUILDING_TYPE.PRODUCTION,
        BUILDING_TYPE.ENERGY_CELL
      ],
      key: BUILDING_KEY.POWER_STATION,
      price: 720,
      roundCost: {
        [RESOURCE_TYPE.ENERGY_CELL]: 800
      },
      roundProduction: {
        [RESOURCE_TYPE.ENERGY]: 2400
      },
      storage: new Storage({
        slots: [
          new StorageSlot({ type: STORAGE_TYPE.ENERGY, value: 20000 }),
          new StorageSlot({ type: STORAGE_TYPE.ENERGY_CELL, value: 1600 })
        ]
      })
    });
  }
}
