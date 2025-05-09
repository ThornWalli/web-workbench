import Vehicle from '../Vehicle';
import Storage, { StorageSlot } from '../Storage';
import LaserCannon from '../vehicleWeapons/LaserCannon';
import { STORAGE_TYPE, VEHICLE_KEY } from '../../types';

export default class Phantom extends Vehicle {
  constructor() {
    super({
      key: VEHICLE_KEY.PHANTOM,
      storage: new Storage({
        slots: [
          new StorageSlot({
            type: STORAGE_TYPE.MINERAL_ORE,
            value: 6000
          })
        ]
      }),
      armor: 60,
      maxArmor: 60,
      weapon: new LaserCannon(),
      price: 7920
    });
  }
}
