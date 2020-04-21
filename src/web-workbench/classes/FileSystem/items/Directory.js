import ItemContainer from '../ItemContainer';
import { ITEM_META } from '../Item';
import { SYMBOL } from '../../../utils/symbols';

export default class Directory extends ItemContainer {
  constructor (...args) {
    super(...args);
    this.meta.set(ITEM_META.SYMBOL, SYMBOL.DIRECTORY);
  }
}
