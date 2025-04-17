import { SYMBOL } from '../../../utils/symbols';
import type { IStorage } from '../../Storage';
import Storage, { type ItemStorageOptions } from './Storage';

export default class RamDisk extends Storage<IStorage> {
  static override TYPE = 'RamDisk';
  constructor(options: ItemStorageOptions<IStorage>) {
    super(options, { type: 'RamDisk', symbol: SYMBOL.RAM_DISK });
  }
}
