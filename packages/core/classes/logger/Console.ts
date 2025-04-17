import { ILogger } from '../Logger';
import { Table } from '../../utils/console';
import { isStringValue, cleanString } from '../../utils/helper';

export default class ConsoleLogger extends ILogger {
  #onAdd: (message: string | string[], options: unknown) => void;

  constructor(
    options: {
      debug?: boolean;
      onAdd?: (
        message: string | string[],
        options: {
          debug?: boolean;
          onAdd?: (message: string | string[], options: unknown) => void;
        }
      ) => void;
    } = {}
  ) {
    const { onAdd } = Object.assign({ debug: false, onAdd: null }, options);
    super(options);
    this.#onAdd =
      onAdd ||
      (() => {
        return;
      });
  }

  override add(message: string | Table, options: unknown) {
    let preparedMessage: string | string[] = '';
    if (message instanceof Table) {
      preparedMessage = message.toColumnify().split(/\n/g);
    }
    if (typeof message === 'string' && isStringValue(message)) {
      preparedMessage = cleanString(message);
    }
    // if (message) {
    this.#onAdd(preparedMessage, options);
    // }
  }
}
