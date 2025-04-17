import type { ItemOptions } from '../Item';
import ItemContainer from '../ItemContainer';

export default class Root extends ItemContainer {
  static TYPE = 'Root';
  constructor(options: ItemOptions) {
    options = { ...options, locked: true, id: 'ROOT' };
    super(options, { name: 'Root' });
  }
}
