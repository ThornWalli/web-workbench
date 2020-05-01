import { ITEM_META } from '../Item';
import { SYMBOL } from '../../../utils/symbols';
import Storage from './Storage';

export default class RamDisk extends Storage {
  static NAME = 'RamDisk';
  constructor (...args) {
    super(...args);
    this.meta.set(ITEM_META.SYMBOL, SYMBOL.RAM_DISK);
  }
}
