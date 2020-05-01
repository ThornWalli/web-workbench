export class ConsoleInterface {
  #core;

  constructor (core) {
    this.#core = core;
  }

  get core () {
    return this.#core;
  }

  /**
   * @override
   */
  // eslint-disable-next-line no-empty-function
  ready () { }

  /**
   * @override
   */
  // eslint-disable-next-line no-empty-function
  prompt (message) { }

  /**
   * @override
   */
  log (...args) {
    console.log(...args);
  }

  /**
   * @override
   */
  // eslint-disable-next-line no-empty-function
  clear (...args) {
    // console.clear(...args);
  }

  /**
   * @override
   */
  // eslint-disable-next-line no-empty-function
  destroy () { }
}
