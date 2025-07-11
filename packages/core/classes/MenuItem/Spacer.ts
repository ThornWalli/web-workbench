import BaseItem from './Base';
import type { BaseItemOption } from './Base';

export default class Spacer extends BaseItem {
  constructor(options?: BaseItemOption) {
    super({
      ...options
    });
  }
}
