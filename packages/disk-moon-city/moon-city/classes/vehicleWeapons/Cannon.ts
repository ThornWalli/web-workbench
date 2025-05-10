import VehicleWeapon from '../VehicleWeapon';

export default class Cannon extends VehicleWeapon {
  constructor() {
    super({
      key: 'cannon',
      damage: 10
    });
  }
}
