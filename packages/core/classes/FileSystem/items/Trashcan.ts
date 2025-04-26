import { SYMBOL } from '../../../utils/symbols';
import ItemContainer from '../ItemContainer';
import type { ItemOptions } from '../types';

export default class Trashcan extends ItemContainer {
  static TYPE = 'Trashcan';
  constructor(options: ItemOptions) {
    super(options, {
      type: 'Trashcan',
      symbol: SYMBOL.TRASHCAN
    });
  }
}
