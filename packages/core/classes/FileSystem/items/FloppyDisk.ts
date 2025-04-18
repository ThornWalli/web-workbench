import type { ItemOptions } from '../Item';
import ItemContainer from '../ItemContainer';

export default class FloppyDisk extends ItemContainer {
  static TYPE = 'FloppyDisk';
  constructor(options: ItemOptions) {
    super(options, { type: 'FloppyDisk' });
  }
}
