import { STORAGE_TYPE, VEHICLE_KEY } from '../../utils/keys';
import Storage, { StorageSlot } from '../Storage';
import Vehicle from '../Vehicle';
import Cannon from '../vehicleWeapons/Cannon';

export default class Hawk extends Vehicle {
  constructor() {
    super({
      key: VEHICLE_KEY.HAWK,
      storage: new Storage({
        slots: [
          new StorageSlot({
            type: STORAGE_TYPE.MINERAL_ORE,
            value: 6000
          })
        ]
      }),
      armor: 40,
      maxArmor: 40,
      weapon: new Cannon(),
      price: 5020
    });
  }
}
