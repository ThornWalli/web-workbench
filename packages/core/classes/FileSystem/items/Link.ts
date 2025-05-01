import Item from '../Item';
import type { ItemOptions } from '../types';

export default class Link extends Item {
  static TYPE = 'Link';
  refPath;
  constructor(options: ItemOptions & { refPath?: string }) {
    options = {
      refPath: undefined,
      ...options
    };
    super(options);
    this.refPath = options.refPath;
  }
}
