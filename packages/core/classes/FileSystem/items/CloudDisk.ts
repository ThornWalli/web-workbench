import { SYMBOL } from '../../../utils/symbols';
import type Storage from '../../Storage';
import type { StorageOptions } from '../types';
import ItemStorage from './Storage';

export default class CloudDisk<
  TStorage extends Storage = Storage
> extends ItemStorage<TStorage> {
  static override TYPE = 'CloudDisk';
  constructor(options: StorageOptions<TStorage>) {
    super(options, { type: CloudDisk.TYPE, symbol: SYMBOL.CLOUD_DISK });
  }
  isLogged(ignore: boolean = false): boolean {
    return ignore || this.storage.storage?.isLogged() || false;
  }
  override isLocked(ignore?: boolean): boolean {
    return this.isLogged(ignore) && super.isLocked(ignore);
  }
}
