import VehicleWeapon from '../VehicleWeapon';

export default class None extends VehicleWeapon {
  constructor() {
    super({
      key: 'none',
      damage: 0
    });
  }
}
