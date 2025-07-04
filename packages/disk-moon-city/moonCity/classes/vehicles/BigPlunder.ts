import { STORAGE_TYPE, VEHICLE_KEY } from '../../types';
import Storage, { StorageSlot } from '../Storage';
import Vehicle from '../Vehicle';
import RocketLauncher from '../vehicleWeapons/RocketLauncher';

export default class BigPlunder extends Vehicle {
  constructor() {
    super({
      key: VEHICLE_KEY.BIG_PLUNDER,
      storage: new Storage({
        slots: [
          new StorageSlot({
            type: STORAGE_TYPE.MINERAL_ORE,
            value: 8000
          })
        ]
      }),
      armor: 90,
      maxArmor: 90,
      weapon: new RocketLauncher(),
      price: 9920
    });
  }
}
