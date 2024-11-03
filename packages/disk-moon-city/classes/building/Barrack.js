import { BUILDING_TYPE, STORAGE_TYPE } from '../../utils/keys';
import Storage from './Storage';

export default class Barrack extends Storage {
  constructor() {
    super({
      type: [
        BUILDING_TYPE.STORAGE,
        BUILDING_TYPE.SECURITY,
        BUILDING_TYPE.SOLDIER,
        BUILDING_TYPE.MERCENARY
      ],
      storageItem: [
        STORAGE_TYPE.SECURITY_SERVICE,
        STORAGE_TYPE.SOLDIER,
        STORAGE_TYPE.MERCENARY
      ],
      key: 'barrack',
      price: 620,
      roundCost: {
        energy: 0
      },
      storage: 50
    });
  }
}
