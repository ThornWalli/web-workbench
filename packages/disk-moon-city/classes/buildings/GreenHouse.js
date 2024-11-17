import {
  BUILDING_KEY,
  BUILDING_TYPE,
  RESOURCE_TYPE,
  STORAGE_TYPE
} from '../../utils/keys';
import Building from '../Building';
import Storage, { StorageSlot } from '../Storage';

export default class GreenHouse extends Building {
  constructor() {
    super({
      type: [
        BUILDING_TYPE.RESOURCE,
        BUILDING_TYPE.PRODUCTION,
        BUILDING_TYPE.FOOD
      ],
      key: BUILDING_KEY.GREEN_HOUSE,
      price: 320,
      storage: new Storage({
        slots: [new StorageSlot({ type: STORAGE_TYPE.FOOD, value: 2000 })]
      }),
      roundCost: {
        [RESOURCE_TYPE.ENERGY]: 100
      },
      roundProduction: {
        [RESOURCE_TYPE.FOOD]: 400
      }
      // roundProductionAction: function ({ consoleLines, city }) {
      //   var value = city.food() + 8000;
      //   var value_ = value;
      //   if (city.maxFood() == city.food()) {
      //     value = city.maxFood();
      //     consoleLines.addLine(
      //       'warning',
      //       '[color=red]Keine Lager - Nahrung verkommt![/color]'
      //     );
      //   }

      //   if (city.maxFood() <= value) value = city.maxFood();

      //   city.food(value);

      //   return value_;
      // }
    });
  }
}
