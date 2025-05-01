import ItemContainer from '../ItemContainer';
import type { ItemContainerOptions } from '../types';

export default class FloppyDisk extends ItemContainer {
  static TYPE = 'FloppyDisk';
  constructor(options: ItemContainerOptions) {
    super(options, {
      type: 'FloppyDisk'
    });
  }
}
