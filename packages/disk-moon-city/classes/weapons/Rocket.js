import Weapon from '../Weapon';

export default class Rocket extends Weapon {
  constructor() {
    super({
      key: 'rocket',
      maxDamage: 1,
      damage: 0,
      price: 2820
    });
  }
}
