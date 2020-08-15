import { Table } from '@/web-workbench/utils/console';
import { isStringValue, cleanString } from '@/web-workbench/utils/helper';
import { ILogger } from '../Logger';

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
