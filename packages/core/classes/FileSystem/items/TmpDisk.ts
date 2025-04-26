import { ITEM_META, type RawObjectData } from '../Item';
import type BaseStorage from '../../Storage';
import ItemStorage, { type ItemStorageOptions } from './Storage';
import type TempStorage from '../../Storage/TempStorage';
import { SYMBOL } from '@web-workbench/core/utils/symbols';

export default class TmpDisk<
  TStorage extends BaseStorage = TempStorage<RawObjectData>
> extends ItemStorage<TStorage> {
  static override TYPE = 'TmpDisk';
  constructor(options: ItemStorageOptions<TStorage>) {
    super(options, {
      type: 'TmpDisk',
      symbol: SYMBOL.TMP_DISK
    });
    this.meta.set(ITEM_META.VISIBLE, false);
  }
}
