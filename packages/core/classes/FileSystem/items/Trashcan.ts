import { SYMBOL } from '../../../utils/symbols';
import type { ItemOptions } from '../Item';
import ItemContainer from '../ItemContainer';

export default class Trashcan extends ItemContainer {
  static TYPE = 'Trashcan';
  constructor(options: ItemOptions) {
    super(options, {
      type: 'Trashcan',
      symbol: SYMBOL.TRASHCAN
    });
  }
}
