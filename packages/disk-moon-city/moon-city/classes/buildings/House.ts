import { BUILDING_KEY, BUILDING_TYPE, STORAGE_TYPE } from '../../types';
import Building from '../Building';
import Storage, { StorageSlot } from '../Storage';

export default class House extends Building {
  constructor() {
    super({
      type: [BUILDING_TYPE.STORAGE],
      key: BUILDING_KEY.HOUSE,
      price: 220,
      storage: new Storage({
        slots: [
          new StorageSlot({
            type: STORAGE_TYPE.HUMAN,
            value: 400
          })
        ]
      })
    });
  }
}
