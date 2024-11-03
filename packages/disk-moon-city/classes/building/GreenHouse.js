import { BUILDING_TYPE } from '../../utils/keys';
import Building from '../Building';

export default class GreenHouse extends Building {
  constructor() {
    super({
      type: [
        BUILDING_TYPE.RESOURCE,
        BUILDING_TYPE.PRODUCTION,
        BUILDING_TYPE.FOOD
      ],
      key: 'green_house',
      price: 320,
      storage: {
        food: 1600
      },
      roundCost: {
        energy: 0
      },
      round_action: null,
      roundProduction: {
        food: 8000
      },
      roundProductionAction: function ({ consoleLines, city }) {
        var value = city.food() + 8000;
        var value_ = value;
        if (city.maxFood() == city.food()) {
          value = city.maxFood();
          consoleLines.addLine(
            'warning',
            '[color=red]Keine Lager - Nahrung verkommt![/color]'
          );
        }

        if (city.maxFood() <= value) value = city.maxFood();

        city.food(value);

        return value_;
      }
    });
  }
}
