import { STORAGE_TYPE, VEHICLE_KEY } from '../../types';
import Storage, { StorageSlot } from '../Storage';
import Vehicle from '../Vehicle';
import None from '../vehicleWeapons/None';

export default class Birdy extends Vehicle {
  constructor() {
    super({
      key: VEHICLE_KEY.BIRDY,
      storage: new Storage({
        slots: [
          new StorageSlot({
            type: STORAGE_TYPE.MINERAL_ORE,
            value: 4000
          })
        ]
      }),
      armor: 20,
      maxArmor: 20,
      weapon: new None(),
      price: 1220
    });
  }
}
