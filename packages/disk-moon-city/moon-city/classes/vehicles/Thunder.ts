import Vehicle from '../Vehicle';
import Storage, { StorageSlot } from '../Storage';
import PlasmaCannon from '../vehicleWeapons/PlasmaCannon';
import { STORAGE_TYPE, VEHICLE_KEY } from '../../types';

export default class Thunder extends Vehicle {
  constructor() {
    super({
      key: VEHICLE_KEY.THUNDER,
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
      weapon: new PlasmaCannon(),
      price: 7920
    });
  }
}
