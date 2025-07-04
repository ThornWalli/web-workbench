import BaseItem from './Base';
import type { BaseItemOption } from './Base';

export default class Separator extends BaseItem {
  constructor(options?: BaseItemOption) {
    super({
      ...options
    });
  }
}
