import { BUILDING_KEY, BUILDING_TYPE, RESOURCE_TYPE } from '../../utils/keys';
import Building from '../Building';

export default class ShieldGenerator extends Building {
  constructor() {
    super({
      type: [BUILDING_TYPE.WEAPON, BUILDING_TYPE.SHIELD],
      key: BUILDING_KEY.SHIELD_GENERATOR,
      price: 4520,
      roundCost: {
        [RESOURCE_TYPE.ENERGY]: 400,
        [RESOURCE_TYPE.CREDITS]: 400
      },

      properties: {
        power: 3 // Die Energie ist relativ zur anzahl der zu zerstörenden Gebäude
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
