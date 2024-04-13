export class ConsoleInterface {
  core;

  constructor(core) {
    this.core = core;
  }

  /**
   * @override
   */
  // eslint-disable-next-line no-empty-function
  ready() {}

  /**
   * @override
   */
  // eslint-disable-next-line no-empty-function, no-unused-vars
  prompt(message) {}

  /**
   * @override
   */
  log(...args) {
    console.log(...args);
  }

  /**
   * @override
   */

  // eslint-disable-next-line no-unused-vars
  clear(...args) {
    // console.clear(...args);
  }

  /**
   * @override
   */
  // eslint-disable-next-line no-empty-function
  destroy() {}
}
