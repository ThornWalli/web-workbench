import ItemContainer from '../ItemContainer';
import { SYMBOL } from '../../../utils/symbols';
import { ITEM_META } from '../types';
import type { ItemOptions } from '../types';

export default class Directory extends ItemContainer {
  static TYPE = 'Directory';
  constructor(options: ItemOptions) {
    super(options, { type: 'Directory', symbol: SYMBOL.DIRECTORY });
    [
      ITEM_META.WINDOW_SCALE,
      ITEM_META.WINDOW_SCROLL_X,
      ITEM_META.WINDOW_SCROLL_Y
    ].forEach(name => {
      if (!this.meta.has(name)) {
        this.meta.set(name, true);
      }
    });
  }
}
