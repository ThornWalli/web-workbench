import ItemContainer from '../ItemContainer';
import type { ItemOptions } from '../types';

export default class Root extends ItemContainer {
  static TYPE = 'Root';
  constructor(options?: ItemOptions) {
    options = { ...options, locked: true, id: 'ROOT', name: 'ROOT' };
    super(options, { type: 'Root' });
  }
}
