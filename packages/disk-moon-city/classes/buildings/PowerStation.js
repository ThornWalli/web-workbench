import {
  BUILDING_KEY,
  BUILDING_TYPE,
  RESOURCE_TYPE,
  STORAGE_TYPE
} from '../../utils/keys.js';
import Building from '../Building.js';
import Storage, { StorageSlot } from '../Storage.js';

export default class PowerStation extends Building {
  constructor() {
    super({
      type: [
        BUILDING_TYPE.RESOURCE,
        BUILDING_TYPE.POWER_STATION,
        BUILDING_TYPE.STORAGE,
        BUILDING_TYPE.PRODUCTION,
        BUILDING_TYPE.ENERGY_CELL
      ],
      key: BUILDING_KEY.POWER_STATION,
      price: 720,
      roundCost: {
        [RESOURCE_TYPE.ENERGY_CELL]: 800
      },
      roundProduction: {
        [RESOURCE_TYPE.ENERGY]: 1600
      },
      storage: new Storage({
        slots: [
          new StorageSlot({ type: STORAGE_TYPE.ENERGY_CELL, value: 1600 })
        ]
      }),
      roundProductionAction: function ({ city }) {
        var value = city.energyCell() >= 800 ? 800 : city.energyCell();

        city.energyCell(city.energyCell() - value);

        // Energiezelle : Strom - 1 : 2
        city.energy(city.energy() + value * 2);
      }
    });
  }
}
