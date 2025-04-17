import Item, { type ItemOptions } from '../Item';

export default class File extends Item {
  static TYPE = 'File';
  constructor(options: ItemOptions) {
    super(options, { type: 'File' });
  }
}
