import VehicleWeapon from '../VehicleWeapon';

export default class RocketLauncher extends VehicleWeapon {
  constructor() {
    super({
      key: 'rocket_launcher',
      damage: 40
    });
  }
}
