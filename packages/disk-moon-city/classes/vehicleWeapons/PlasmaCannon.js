import VehicleWeapon from '../VehicleWeapon';

export default class PlasmaCannon extends VehicleWeapon {
  constructor() {
    super({
      key: 'plasma_cannon',
      damage: 3 / 4
    });
  }
}
