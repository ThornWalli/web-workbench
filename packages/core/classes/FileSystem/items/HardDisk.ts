import { SYMBOL } from '../../../utils/symbols';
import type { IStorage } from '../../Storage';
import Storage, { type ItemStorageOptions } from './Storage';

export default class HardDisk extends Storage<IStorage> {
  static override TYPE = 'HardDisk';
  constructor(options: ItemStorageOptions<IStorage>) {
    super(options, { type: 'HardDisk', symbol: SYMBOL.HARD_DISK });
  }
}
