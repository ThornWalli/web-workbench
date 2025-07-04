import Vehicle from '../Vehicle';
import Storage, { StorageSlot } from '../Storage';
import None from '../vehicleWeapons/None';
import { STORAGE_TYPE, VEHICLE_KEY } from '../../types';

export default class Shrimp extends Vehicle {
  constructor() {
    super({
      key: VEHICLE_KEY.SHRIMP,
      storage: new Storage({
        slots: [
          new StorageSlot({
            type: STORAGE_TYPE.MINERAL_ORE,
            value: 2000
          })
        ]
      }),
      armor: 20,
      maxArmor: 20,
      weapon: new None(),
      price: 920
    });
  }
}
