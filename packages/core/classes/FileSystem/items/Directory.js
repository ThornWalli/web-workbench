import ItemContainer from '../ItemContainer';
import { SYMBOL } from '../../../utils/symbols';
import { ITEM_META } from '../Item';

export default class Directory extends ItemContainer {
  static NAME = 'Directory';
  static SYMBOL = SYMBOL.DIRECTORY;
  constructor(...args) {
    super(...args);
    [
      ITEM_META.WINDOW_SCALE,
      ITEM_META.WINDOW_SCROLL_X,
      ITEM_META.WINDOW_SCROLL_Y
    ].forEach(name => {
      if (!this.meta.has(name, true)) {
        this.meta.set(name, true);
      }
    });
  }
}
