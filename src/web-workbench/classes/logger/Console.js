import { ILogger } from '../Logger';
import { Table } from '@/web-workbench/utils/console';
import { isStringValue, cleanString } from '@/web-workbench/utils/helper';

export default class ConsoleLogger extends ILogger {
  #onAdd;

  constructor ({ onAdd }) {
    super();
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
