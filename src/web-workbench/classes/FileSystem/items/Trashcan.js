import { ITEM_META } from '../Item';
import { SYMBOL } from '../../../utils/symbols';
import ItemContainer from '../ItemContainer';

export default class Trashcan extends ItemContainer {
  static NAME = 'Trashcan';
  constructor (...args) {
    super(...args);
    this.meta.set(ITEM_META.SYMBOL, SYMBOL.TRASHCAN);
  }
}
