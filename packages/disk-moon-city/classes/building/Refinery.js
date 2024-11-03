import { BUILDING_TYPE } from '../../utils/keys';
import Building from '../Building';

export default class Refinery extends Building {
  constructor() {
    super({
      type: [
        BUILDING_TYPE.RESOURCE,
        BUILDING_TYPE.REFINERY,
        BUILDING_TYPE.STORAGE,
        BUILDING_TYPE.ORE,
        BUILDING_TYPE.ENERGY_CELL
      ],
      key: 'refinery',
      price: 520,
      roundCost: {
        energy: 0,
        ore: 400
      },
      storage: {
        energy_cell: 400,
        ore: 400
      },
      roundProduction: {
        energy_cell: 400
      },
      roundProductionAction: function ({ city, consoleLines }) {
        var value = city.ore() >= 400 ? 400 : city.ore();

        if (city.maxEnergyCell() < city.energyCell() + value) {
          city.energyCell(city.maxEnergyCell());

          consoleLines.addLine(
            'warning',
            '[color=red]Sie haben nicht genug Energiezellenlager[/color]'
          );
        } else {
          city.ore(city.ore() - value);
          city.energyCell(city.energyCell() + value);
        }
      }
    });
  }
}
