import { BUILDING_KEY, BUILDING_TYPE, RESOURCE_TYPE } from '../../utils/keys';
import Building from '../Building';
import Storage, { StorageSlot } from '../Storage';

export default class ShieldGenerator extends Building {
  constructor() {
    super({
      type: [BUILDING_TYPE.WEAPON, BUILDING_TYPE.SHIELD],
      key: BUILDING_KEY.SHIELD_GENERATOR,
      price: 4520,
      storage: new Storage({
        slots: [
          new StorageSlot({ type: RESOURCE_TYPE.SHIELD_ENERGY, value: 3 })
        ]
      }),
      roundCost: {
        [RESOURCE_TYPE.ENERGY]: 400,
        [RESOURCE_TYPE.CREDITS]: 400
      },
      roundProduction: {
        [RESOURCE_TYPE.SHIELD_ENERGY]: 3
      },
      roundProductionAction: function ({ city, consoleLines }) {
        var cityHasCredits = false;
        var cityHasEnergy = false;

        if (city.credits() - 400 > 0) {
          cityHasCredits = true;
        } else if (city.energy() - 400 > 0) {
          cityHasEnergy = true;
        }

        if (!cityHasCredits)
          consoleLines.addLine(
            'warning',
            '[color=red]Nicht genug Credits fuer Ihre Schilder[/color]'
          );

        if (!cityHasEnergy)
          consoleLines.addLine(
            'warning',
            '[color=red]Nicht genug Strom fuer Ihre Schilder[/color]'
          );

        if (cityHasCredits && cityHasEnergy) {
          city.credits(city.credits() - 400);
          city.energy(city.energy() - 400);

          return 400;
        }

        return false;
      }
    });
  }
}
