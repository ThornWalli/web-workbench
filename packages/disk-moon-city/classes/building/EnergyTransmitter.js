import { BUILDING_TYPE } from '../../utils/keys';
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
      key: 'energy_transmitter',
      price: 3220,
      roundCost: {
        energy: 1600
      },
      roundProduction: {
        credits: 1600
      },
      roundProductionAction: function ({ city }) {
        var value = city.energy() >= 1600 ? 1600 : city.energy();

        city.credits(city.credits() + value);
        city.energy(city.energy() - value);

        return value;
      }
    });
  }
}
