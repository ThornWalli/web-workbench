import Weapon from '../Weapon';

export default class SearchRocket extends Weapon {
  constructor() {
    super({
      key: 'search_rocket',
      maxDamage: 4,
      damage: 1,
      price: 4520
    });
  }
}
