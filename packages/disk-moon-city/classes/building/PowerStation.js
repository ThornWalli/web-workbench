import { BUILDING_TYPE } from '../../utils/keys';
import Building from '../Building';

export default class Refinery extends Building {
  constructor() {
    super({
      type: [
        BUILDING_TYPE.RESOURCE,
        BUILDING_TYPE.POWER_STATION,
        BUILDING_TYPE.STORAGE,
        BUILDING_TYPE.ENERGY_CELL
      ],
      key: 'power_station',
      price: 720,
      roundCost: {
        energy: 0,
        energy_cell: 800
      },
      storage: {
        energy_cell: 1600
      },
      roundProduction: {
        energy: 1600
      },
      roundProductionAction: function ({ city }) {
        var value = city.energyCell() >= 800 ? 800 : city.energyCell();

        city.energyCell(city.energyCell() - value);

        // Energiezelle : Strom - 1 : 2
        city.energy(city.energy() + value * 2);
      }
    });
  }
}
