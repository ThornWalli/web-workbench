import { Table as ConsoleTable } from '../utils/console';

export class ILogger {
  #core;
  #debug = false;
  #consoleInterface;

  constructor (options) {
    const { core, debug, consoleInterface } = Object.assign({ core: null, debug: false, consoleInterface: null }, options);
    this.#core = core;
    this.#debug = debug;
    this.#consoleInterface = consoleInterface;
  }

  // eslint-disable-next-line no-empty-function
  add (message, options) {}

  get core () {
    return this.#core;
  }

  get debug () {
    return this.#debug;
  }

  get consoleInterface () {
    return this.#consoleInterface;
  }
}

export default class Logger extends ILogger {
  static TYPE = {
    DEBUG: 'debug',
    INFO: 'info',
    OUTPUT: 'output'
  };

  #silent;
  #entries = [];
  #color = false;

  constructor (options) {
    const { silent, color } = options = Object.assign({
      /**
       * Wenn gesetzt dient Logger als Speicher und bleibt still.
       */
      silent: false,
      color: false
    }, options);
    super(options);
    this.#silent = silent;
    this.#color = color;
  }

  add (message, options) {
    const { namespace, type } = Object.assign({ namespace: null, type: Logger.TYPE.INFO }, options);

    this.#entries.push(message);

    if (!this.#silent && type !== Logger.TYPE.DEBUG) {
      if (namespace) {
        if (this.#color) {
          console.log(
            '%c[ %s ]%c[ %s ]', 'background: #000; color: #008000', type, 'background: #000; color: #90ee90', namespace, message
          );
        } else {
          console.log(
            `[ ${type.toUpperCase()} ][ ${namespace} ]`,
            message);
        }
      } else if (message instanceof ConsoleTable) {
        this.consoleInterface.table(message);
      } else {
        this.consoleInterface.log(
          // `[ ${type.toUpperCase()} ]`,
          message);
      }
    }
  }
}
