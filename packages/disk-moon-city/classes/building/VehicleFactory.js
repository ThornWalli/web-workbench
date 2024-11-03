import { BUILDING_TYPE } from '../../utils/keys';
import Building from '../Building';

export default class VehicleFactory extends Building {
  constructor() {
    super({
      type: [
        BUILDING_TYPE.INDUSTRIAL,
        BUILDING_TYPE.VEHICLE,
        BUILDING_TYPE.PRODUCTION,
        BUILDING_TYPE.FACTORY
      ],
      key: 'vehicle_factory',
      price: 570,
      roundCost: {
        energy: 0
      }
    });
  }
}
