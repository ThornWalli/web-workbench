import Vehicle from '../Vehicle';
import Storage, { StorageSlot } from '../Storage';
import Cannon from '../vehicleWeapons/Cannon';
import { STORAGE_TYPE, VEHICLE_KEY } from '../../types';

export default class Spider extends Vehicle {
  constructor() {
    super({
      key: VEHICLE_KEY.SPIDER,
      storage: new Storage({
        slots: [
          new StorageSlot({
            type: STORAGE_TYPE.MINERAL_ORE,
            value: 4000
          })
        ]
      }),
      armor: 40,
      maxArmor: 40,
      weapon: new Cannon(),
      price: 4220
    });
  }
}
