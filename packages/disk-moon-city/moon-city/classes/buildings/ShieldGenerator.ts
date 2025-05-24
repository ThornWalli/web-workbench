import {
  BUILDING_KEY,
  BUILDING_TYPE,
  RESOURCE_TYPE,
  STORAGE_TYPE
} from '../../types';
import Building from '../Building';
import Storage, { StorageSlot } from '../Storage';

export default class ShieldGenerator extends Building {
  constructor() {
    super({
      type: [BUILDING_TYPE.WEAPON, BUILDING_TYPE.SHIELD],
      key: BUILDING_KEY.SHIELD_GENERATOR,
      price: 4520,
      storage: new Storage({
        slots: [new StorageSlot({ type: STORAGE_TYPE.SHIELD_ENERGY, value: 3 })]
      }),
      roundCost: {
        [RESOURCE_TYPE.ENERGY]: 400,
        [RESOURCE_TYPE.CREDITS]: 400
      },
      roundProduction: {
        [RESOURCE_TYPE.SHIELD_ENERGY]: 3
      }
    });
  }
}
