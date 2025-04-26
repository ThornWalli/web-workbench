import { SYMBOL } from '../../../utils/symbols';
import type BaseStorage from '../../Storage';
import type { StorageOptions } from '../types';
import ItemStorage from './Storage';

export default class CloudDisk<
  TStorage extends BaseStorage
> extends ItemStorage<TStorage> {
  static override TYPE = 'CloudDisk';
  constructor(options: StorageOptions<TStorage>) {
    super(options, { type: CloudDisk.TYPE, symbol: SYMBOL.CLOUD_DISK });
  }
  isLogged() {
    return this.storage.storage?.isLogged() || false;
  }
}
