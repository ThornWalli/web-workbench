import { ITEM_META } from '../Item';
import { SYMBOL } from '../../../utils/symbols';
import Storage, { type ItemStorageOptions } from './Storage';
import type { MapStorage } from '../../Storage';

export default class TmpDisk extends Storage<MapStorage> {
  static override TYPE = 'TmpDisk';
  constructor(options: ItemStorageOptions<MapStorage>) {
    super(options, {
      type: 'TmpDisk',
      symbol: SYMBOL.TMP_DISK
    });
    this.meta.set(ITEM_META.VISIBLE, false);
  }
}
