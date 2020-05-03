import { SYMBOL } from '../../../utils/symbols';
import Storage from './Storage';

export default class CloudDisk extends Storage {
  static NAME = 'CloudDisk';
  static SYMBOL = SYMBOL.CLOUD_DISK;

  isLogged () {
    return this.storage.storage.isLogged();
  }
}
