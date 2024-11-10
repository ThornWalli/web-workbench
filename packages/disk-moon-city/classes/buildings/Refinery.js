import {
  BUILDING_KEY,
  BUILDING_TYPE,
  RESOURCE_TYPE,
  STORAGE_TYPE
} from '../../utils/keys';
import Building from '../Building';
import Storage, { StorageSlot } from '../Storage';

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
      key: BUILDING_KEY.REFINERY,
      price: 520,
      roundCost: {
        energy: 0,
        ore: 400
      },
      storage: new Storage({
        slots: [
          new StorageSlot({ type: STORAGE_TYPE.MINERAL_ORE, value: 400 }),
          new StorageSlot({ type: STORAGE_TYPE.ENERGY_CELL, value: 400 })
        ]
      }),
      roundProduction: {
        [RESOURCE_TYPE.ENERGY_CELL]: 400
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
