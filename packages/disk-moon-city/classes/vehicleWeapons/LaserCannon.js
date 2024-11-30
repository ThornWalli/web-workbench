import VehicleWeapon from '../VehicleWeapon';

export default class LaserCannon extends VehicleWeapon {
  constructor() {
    super({
      key: 'laser_cannon',
      damage: 20
    });
  }
}
