export class ConsoleInterface {
  /**
   * @override
   */
  // eslint-disable-next-line no-empty-function
  ready() {}

  /**
   * @override
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty-function
  prompt(message: string) {}

  /**
   * @override
   */
  log(...args: string[]) {
    console.log(...args);
  }

  /**
   * @override
   */

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clear(...args: string[]) {
    // console.clear(...args);
  }

  /**
   * @override
   */
  // eslint-disable-next-line no-empty-function
  destroy() {}
}
