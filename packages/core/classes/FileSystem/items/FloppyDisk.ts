import type { ItemContainerOptions } from '../ItemContainer';
import ItemContainer from '../ItemContainer';

export default class FloppyDisk extends ItemContainer {
  static TYPE = 'FloppyDisk';
  constructor(options: ItemContainerOptions) {
    super(options, {
      type: 'FloppyDisk'
    });
  }
}
