import type { RawObjectData } from '../Item';
import type BaseStorage from '../../Storage';
import ItemStorage, { type ItemStorageOptions } from './Storage';
import type TempStorage from '../../Storage/TempStorage';
import { SYMBOL } from '@web-workbench/core/utils/symbols';

export default class RamDisk<
  TStorage extends BaseStorage = TempStorage<RawObjectData>
> extends ItemStorage<TStorage> {
  static override TYPE = 'RamDisk';
  constructor(options: ItemStorageOptions<TStorage>) {
    super(options, {
      type: 'RamDisk',
      symbol: SYMBOL.RAM_DISK
    });
  }
}
