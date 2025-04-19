import { SYMBOL } from '../../../utils/symbols';
import type BaseStorage from '../../Storage';
import ItemStorage, { type ItemStorageOptions } from './Storage';

export default class CloudDisk<
  TStorage extends BaseStorage
> extends ItemStorage<TStorage> {
  static override TYPE = 'CloudDisk';
  constructor(options: ItemStorageOptions<TStorage>) {
    super(options, { type: CloudDisk.TYPE, symbol: SYMBOL.CLOUD_DISK });
  }
  isLogged() {
    return this.storage.storage?.isLogged() || false;
  }
}
