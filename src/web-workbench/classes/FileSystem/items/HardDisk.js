import { ITEM_META } from '../Item';
import { SYMBOL } from '../../../utils/symbols';
import Storage from './Storage';

export default class HardDisk extends Storage {
  static NAME = 'HardDisk';
  constructor (...args) {
    super(...args);
    this.meta.set(ITEM_META.SYMBOL, SYMBOL.HARD_DISK);
  }
}
