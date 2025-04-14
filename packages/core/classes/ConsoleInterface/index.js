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
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, no-empty-function
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

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  clear(...args) {
    // console.clear(...args);
  }

  /**
   * @override
   */
  // eslint-disable-next-line no-empty-function
  destroy() {}
}
