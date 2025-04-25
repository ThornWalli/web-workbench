import { ILogger, type ILoggerOptions } from '../Logger';
import { Table } from '../../utils/console';
import {
  isEmptyStringWrap,
  isStringValue,
  unwrapString
} from '../../utils/helper';

export default class ConsoleLogger extends ILogger {
  onAdd: (message: string | string[], options: unknown) => void;

  constructor(
    options: ILoggerOptions & {
      onAdd?: (message: string | string[], options: unknown) => void;
    } = {}
  ) {
    const { onAdd } = { onAdd: null, ...options };

    super(options);
    this.onAdd = onAdd || (() => void 0);
  }

  override add(message: string | Table, options: unknown) {
    let preparedMessage: string | string[] = '';

    let force = false;
    if (typeof message === 'string' && isEmptyStringWrap(message)) {
      force = true;
    } else {
      if (message instanceof Table) {
        preparedMessage = message.toColumnify().split(/\n/g);
      }
      if (typeof message === 'string' && isStringValue(message)) {
        preparedMessage = unwrapString(message);
      }
    }

    if (typeof message === 'string' && /^> \w+/.test(message)) {
      this.onAdd(message, options);
    } else if (force || preparedMessage.length) {
      this.onAdd(preparedMessage, options);
    }
  }
}
