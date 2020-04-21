import Item from '../Item';

export default class Link extends Item {
  #refPath;
  constructor (options) {
    options = Object.assign({
      refPath: null
    }, options);
    super(options);
    this.#refPath = options.refPath;
  }

  get refPath () {
    return this.#refPath;
  }

  set refPath (refPath) {
    this.#refPath = refPath;
  }
}
