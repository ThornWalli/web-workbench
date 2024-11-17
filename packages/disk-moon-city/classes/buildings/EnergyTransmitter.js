import { BUILDING_KEY, BUILDING_TYPE, RESOURCE_TYPE } from '../../utils/keys';
import Building from '../Building';

export default class EnergyTransmitter extends Building {
  constructor() {
    super({
      type: [
        BUILDING_TYPE.RESOURCE,
        BUILDING_TYPE.COMMERCE,
        BUILDING_TYPE.ENERGY,
        BUILDING_TYPE.TRANSMITTER
      ],
      key: BUILDING_KEY.ENERGY_TRANSMITTER,
      price: 3220,
      roundCost: {
        [RESOURCE_TYPE.ENERGY]: 1600
      },
      roundProduction: {
        [RESOURCE_TYPE.CREDITS]: 1600
      }
    });
  }
}
