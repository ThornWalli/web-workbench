import { BUILDING_KEY, BUILDING_TYPE, RESOURCE_TYPE } from '../../utils/keys';
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
      key: BUILDING_KEY.VEHICLE_FACTORY,
      price: 570,
      roundCost: {
        [RESOURCE_TYPE.ENERGY]: 0
      }
    });
  }
}
