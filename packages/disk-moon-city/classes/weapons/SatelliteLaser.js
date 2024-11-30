import { WEAPON_KEY } from '../../utils/keys';
import Weapon from '../Weapon';

export default class SatelliteLaser extends Weapon {
  constructor() {
    super({
      key: WEAPON_KEY.SATELLITE_LASER,
      maxDamage: 8,
      damage: 3,
      // maxDamage: 4,
      // damage: 1,
      price: 6520
    });
  }
}
