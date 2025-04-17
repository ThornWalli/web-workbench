import { SYMBOL } from '../../../utils/symbols';
import type { IStorage } from '../../Storage';
import Storage, { type ItemStorageOptions } from './Storage';

export default class CloudDisk extends Storage<IStorage> {
  static override TYPE = 'CloudDisk';
  constructor(options: ItemStorageOptions<IStorage>) {
    super(options, { type: CloudDisk.TYPE, symbol: SYMBOL.CLOUD_DISK });
  }
  isLogged() {
    return this.storage.storage.isLogged();
  }
}
