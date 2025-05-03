import { WEAPON_KEY } from '../../types';
import Weapon from '../Weapon';

export default class Rocket extends Weapon {
  constructor() {
    super({
      key: WEAPON_KEY.ROCKET,
      maxDamage: 1,
      damage: 0,
      price: 2820
    });
  }
}
