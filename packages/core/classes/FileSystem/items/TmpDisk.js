import { ITEM_META } from '../Item';
import { SYMBOL } from '../../../utils/symbols';
import Storage from './Storage';

export default class TmpDisk extends Storage {
  static NAME = 'TmpDisk';
  static SYMBOL = SYMBOL.TMP_DISK;
  constructor(...args) {
    super(...args);
    this.meta.set(ITEM_META.VISIBLE, false);
  }
}
