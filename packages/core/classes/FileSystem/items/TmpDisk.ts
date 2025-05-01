import type BaseStorage from '../../Storage';
import type TempStorage from '../../Storage/TempStorage';
import { SYMBOL } from '../../../utils/symbols';
import ItemStorage from './Storage';
import { ITEM_META, type RawObjectData, type StorageOptions } from '../types';

export default class TmpDisk<
  TStorage extends BaseStorage = TempStorage<RawObjectData>
> extends ItemStorage<TStorage> {
  static override TYPE = 'TmpDisk';
  constructor(options: StorageOptions<TStorage>) {
    super(options, {
      type: 'TmpDisk',
      symbol: SYMBOL.TMP_DISK
    });
    this.meta.set(ITEM_META.VISIBLE, false);
    this.meta.set(ITEM_META.IGNORE_SYMBOL_REARRANGE, true);
  }
}
