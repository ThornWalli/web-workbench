import { ILogger } from '../Logger';
import { Table } from '../..//utils/console';
import { isStringValue, cleanString } from '../../utils/helper';

export default class ConsoleLogger extends ILogger {
  #onAdd;

  constructor (options) {
    const { onAdd } = Object.assign({ debug: false, onAdd: null }, options);
    super(options);
    this.#onAdd = onAdd;
  }

  add (message, options) {
    if (message instanceof Table) {
      message = message.toColumnify().split(/\n/g);
    }
    if (isStringValue(message)) {
      message = cleanString(message);
    }
    // if (message) {
    this.#onAdd(message, options);
    // }
  }
}
