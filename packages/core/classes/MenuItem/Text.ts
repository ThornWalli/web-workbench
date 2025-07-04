import type { ComputedRef } from 'vue';
import BaseItem from './Base';
import type { BaseItemOption } from './Base';

export interface TextMenuItemOption extends BaseItemOption {
  text?: string | ComputedRef<string>;
}

export default class Text extends BaseItem {
  text?: string | ComputedRef<string>;
  constructor({ text, ...options }: TextMenuItemOption) {
    super({
      ...options
    });
    this.text = text;
  }
}
