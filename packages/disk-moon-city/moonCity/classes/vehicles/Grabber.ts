import { STORAGE_TYPE, VEHICLE_KEY } from '../../types';
import Storage, { StorageSlot } from '../Storage';
import Vehicle from '../Vehicle';
import None from '../vehicleWeapons/None';

export default class Grabber extends Vehicle {
  constructor() {
    super({
      key: VEHICLE_KEY.GRABBER,
      storage: new Storage({
        slots: [new StorageSlot({ type: STORAGE_TYPE.MINERAL_ORE, value: 800 })]
      }),
      armor: 10,
      maxArmor: 10,
      weapon: new None(),
      price: 720
    });
  }
}
