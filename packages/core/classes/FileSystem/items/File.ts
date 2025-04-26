import Item from '../Item';
import type { ItemOptions } from '../types';

export default class File extends Item {
  static TYPE = 'File';
  constructor(options: ItemOptions) {
    super(options, { type: 'File' });
  }
}
