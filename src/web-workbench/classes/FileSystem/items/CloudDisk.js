import { SYMBOL } from '../../../utils/symbols';
import { ITEM_META } from '../Item';
import Storage from './Storage';

export default class CloudDisk extends Storage {
  static NAME = 'CloudDisk';
  constructor (...args) {
    super(...args);
    this.meta.set(ITEM_META.SYMBOL, SYMBOL.CLOUD_DISK);
  }

  isLogged () {
    return this.storage.storage.isLogged();
  }
}
