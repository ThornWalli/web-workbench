import { Table as ConsoleTable } from '../utils/console';
import type { ConsoleInterface } from './ConsoleInterface';
import type Core from './Core';

export interface ILoggerOptions {
  core?: Core;
  debug?: boolean;
  consoleInterface?: ConsoleInterface;
}
export class ILogger {
  core?: Core;
  debug = false;
  consoleInterface;

  constructor(options: ILoggerOptions) {
    const { core, debug, consoleInterface } = {
      debug: false,
      ...options
    };
    this.core = core;
    this.debug = debug;
    this.consoleInterface = consoleInterface;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty-function
  add(message: string, options: { namespace?: string; type?: string }) {}
}

export default class Logger extends ILogger {
  static TYPE = {
    DEBUG: 'debug',
    INFO: 'info',
    OUTPUT: 'output'
  };

  silent;
  entries: (string | ConsoleTable)[] = [];
  color = false;

  constructor(options: { silent?: boolean; color?: boolean } & ILoggerOptions) {
    const { silent, color } = {
      /**
       * Wenn gesetzt dient Logger als Speicher und bleibt still.
       */
      silent: false,
      color: false,
      ...options
    };

    super(options);
    this.silent = silent;
    this.color = color;
  }

  override add(
    message: string | ConsoleTable,
    options: { namespace?: string; type?: string } = {}
  ) {
    const { namespace, type } = {
      namespace: null,
      type: Logger.TYPE.INFO,
      ...options
    };

    this.entries.push(message);

    if (!this.silent && type !== Logger.TYPE.DEBUG) {
      if (namespace) {
        if (this.color) {
          console.log(
            '%c[ %s ]%c[ %s ]',
            'background: #000; color: #008000',
            type,
            'background: #000; color: #90ee90',
            namespace,
            message
          );
        } else {
          console.log(`[ ${type.toUpperCase()} ][ ${namespace} ]`, message);
        }
      } else if (message instanceof ConsoleTable) {
        this.consoleInterface?.table(message);
      } else {
        this.consoleInterface?.log(
          // `[ ${type.toUpperCase()} ]`,
          message
        );
      }
    }
  }
}
