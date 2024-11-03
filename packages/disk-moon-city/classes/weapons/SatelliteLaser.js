import Weapon from '../Weapon';

export default class SatelliteLaser extends Weapon {
  constructor() {
    super({
      key: 'satellite_laser',
      maxDamage: 4,
      damage: 1,
      price: 6520
    });
  }
}
