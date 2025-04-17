import Item, { type ItemOptions } from '../Item';

export default class Link extends Item {
  static TYPE = 'Link';
  #refPath;
  constructor(options: ItemOptions & { refPath?: string }) {
    options = {
      refPath: undefined,
      ...options
    };
    super(options);
    this.#refPath = options.refPath;
  }

  get refPath() {
    return this.#refPath;
  }

  set refPath(refPath) {
    this.#refPath = refPath;
  }
}
