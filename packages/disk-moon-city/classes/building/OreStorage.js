import { BUILDING_TYPE, STORAGE_TYPE } from '../../utils/keys';
import Storage from './Storage';

export default class OreStorage extends Storage {
  constructor() {
    super({
      type: [BUILDING_TYPE.RESOURCE, BUILDING_TYPE.ORE, BUILDING_TYPE.STORAGE],
      key: 'ore_storage',
      price: 920,
      roundCost: {
        [STORAGE_TYPE.ENERGY]: 0
      },
      storageTypes: [STORAGE_TYPE.MINERAL_ORE],
      storage: 1600
    });
  }
}
