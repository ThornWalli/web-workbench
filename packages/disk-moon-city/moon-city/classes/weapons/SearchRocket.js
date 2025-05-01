import { WEAPON_KEY } from '../../utils/keys';
import Weapon from '../Weapon';

export default class SearchRocket extends Weapon {
  constructor() {
    super({
      key: WEAPON_KEY.SEARCH_ROCKET,
      maxDamage: 4,
      damage: 1,
      price: 4520
    });
  }
}
