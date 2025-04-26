import type BaseStorage from '../../Storage';
import ItemStorage from './Storage';
import type TempStorage from '../../Storage/TempStorage';
import { SYMBOL } from '../../../utils/symbols';
import type { RawObjectData, StorageOptions } from '../types';

export default class HardDisk<
  TStorage extends BaseStorage = TempStorage<RawObjectData>
> extends ItemStorage<TStorage> {
  static override TYPE = 'HardDisk';
  constructor(options: StorageOptions<TStorage>) {
    super(options, {
      type: 'HardDisk',
      symbol: SYMBOL.HARD_DISK
    });
  }
}
