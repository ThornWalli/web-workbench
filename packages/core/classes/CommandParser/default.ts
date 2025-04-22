import { camelCase } from 'change-case';
import { prepareString } from '../../utils/helper';
import type MathParser from '../MathParser';
import {
  parse,
  ValueType,
  type Result,
  type Value
} from '../../services/commandParser';
import type { CommandResult } from '../Command';

export default class CommandParser {
  static REGEX_VALUE_RESOLVE = /[$]{3}(\d+)/;
  static REGEX_COMMAND_REPLACE = /^([a-zA-Z]+[a-zA-Z0-9_]+) (.*)$/;
  static REGEX_PARAM_KWARG = /^[-]{0,2}([\\-\w]+)=(.*)$/;
  static REGEX_PARAM_ARG = /^[-]{1,2}([\\-\w]+)$/;

  #mathParser;

  constructor(mathParser: MathParser) {
    this.#mathParser = mathParser;
  }

  async parse(input: string): Promise<CommandResult> {
    const data = parse(input, { forceProgram: true });

    const preparedArguments = await this.getArguments(data);

    return {
      origin: input,
      unresolved: getUnresolved(data),
      args: preparedArguments.args,
      kwargs: preparedArguments.kwargs,
      command: data.program || '',
      commandValue: input
    };
  }

  async getArguments(data: Result) {
    return {
      args: await Promise.all(
        data.args
          .filter(arg => arg.plain)
          .map(arg => {
            if (arg.value) {
              return this.parseValue(arg.value);
            }
          })
      ),
      kwargs: Object.fromEntries(
        await Promise.all(
          data.args
            .filter(arg => !arg.plain)
            .map(async arg => [
              camelCase(arg.name || ''),
              (arg.value && (await this.parseValue(arg.value))) || undefined
            ])
        )
      )
    };
  }

  parseValue({ value, type }: Value) {
    if (
      typeof value === 'string' &&
      [ValueType.ANY, ValueType.TERM].includes(type)
    ) {
      return this.#mathParser.parse(value.replace(/ *([a-zA-Z_-]+) */, '$1'));
    }
    return Promise.resolve(value);
  }

  /**
   * @deprecated muss neu!
   */
  // eslint-disable-next-line complexity
  static extractStrings(input: string) {
    let record = false;
    let recordStartIndex = 0;
    const values = [];

    let singleQuote = false;

    for (let i = input.length - 1; i >= 0; i--) {
      const element = input[Number(i)];
      const nextChar = input[i - 1];

      if (!singleQuote && element === '"' && nextChar !== '\\') {
        if (record) {
          record = false;
          values.push(input.slice(i, recordStartIndex + 1));
        } else {
          singleQuote = false;
          record = true;
          recordStartIndex = i;
        }
      } else if (
        ((!record && singleQuote) || singleQuote) &&
        element === "'" &&
        nextChar !== '\\'
      ) {
        if (record) {
          singleQuote = false;
          record = false;
          values.push(input.slice(i, recordStartIndex + 1));
        } else {
          singleQuote = true;
          record = true;
          recordStartIndex = i;
        }
      }
    }
    if (record) {
      throw new Error("can't extract values; " + input);
    }

    const result = values.reduce(
      (result, value, i) => result.replace(value, CommandParser.resolveKey(i)),
      input
    );
    return { result, values };
  }

  // eslint-disable-next-line complexity
  static extractValues(input: string, splitter = ' ') {
    let record = false;
    let recordStartIndex = 0;
    const values = [];

    let singleQuote = false;

    for (let i = input.length - 1; i >= 0; i--) {
      const element = input[Number(i)];
      const nextChar = input[i - 1];

      if (!singleQuote && element === '"' && nextChar !== '\\') {
        if (record) {
          record = false;
          values.push(input.slice(i, recordStartIndex + 1));
        } else {
          singleQuote = false;
          record = true;
          recordStartIndex = i;
        }
      } else if (
        ((!record && singleQuote) || singleQuote) &&
        element === "'" &&
        nextChar !== '\\'
      ) {
        if (record) {
          singleQuote = false;
          record = false;
          values.push(input.slice(i, recordStartIndex + 1));
        } else {
          singleQuote = true;
          record = true;
          recordStartIndex = i;
        }
      }
    }
    if (record) {
      throw new Error("can't extract values; " + input);
    }

    // const extractedFunctions = CommandParser.extractFunctions(input);
    // input = extractedFunctions.input;

    // while (extractedFunctions.values.length > 0) {
    //   input = input.replace(`$$$${extractedFunctions.values.length - 1}`, extractedFunctions.values.pop());
    // }

    values.forEach((value, i) => {
      input = input.replace(value, CommandParser.resolveKey(i));
    });

    // values.forEach((value, i) => {
    //   input = input.replace(value, CommandParser.resolveKey((extractedFunctions.values.length) + i));
    // });
    // values = extractedFunctions.values.concat(values);
    const params = input.split(splitter).filter(value => value);
    return { params, values };
  }

  static resolveKey(index: number) {
    return `$$$$$$${index}`;
  }

  static resolveValues({
    params,
    values
  }: {
    params: string[];
    values: string[];
  }) {
    return params.map(param => CommandParser.resolveValue(param, values));
  }

  static valueUnresolved(value: string | number | boolean) {
    return (
      typeof value === 'string' && CommandParser.REGEX_VALUE_RESOLVE.test(value)
    );
  }

  static resolveValue(
    value: string | number | boolean,
    values: (string | number | boolean | undefined)[]
  ) {
    let resolvedValue: string | number | boolean | undefined = value;
    if (CommandParser.valueUnresolved(value)) {
      resolvedValue = String(value)
        .match(/[$]{3}(\d+)/g)
        ?.reduce((result, value) => {
          return result.replace(
            value,
            values[
              Number(value.replace(CommandParser.REGEX_VALUE_RESOLVE, '$1'))
            ] as string
          );
        }, String(value));

      // value = values[Number(value.replace(CommandParser.REGEX_VALUE_RESOLVE, '$1'))];
      if (/[\w]+[$%]?[ ]*\(/.test(resolvedValue || '')) {
        return resolvedValue;
      } else if (typeof resolvedValue === 'string') {
        if (resolvedValue === 'undefined') {
          return undefined;
        } else if (isNumeric(resolvedValue)) {
          return Number(resolvedValue);
        } else if (!resolvedValue.startsWith('"')) {
          return prepareString(resolvedValue);
        }
      }
    }
    return resolvedValue;
  }
}

function isNumeric(value: string) {
  return !isNaN(Number(value));
}

function getUnresolved(data: Result) {
  return {
    args: data.args.filter(arg => arg.plain).map(arg => arg.value?.raw || ''),
    kwargs: Object.fromEntries(
      data.args
        .filter(arg => !arg.plain)
        .map(arg => [camelCase(arg.name || ''), arg.value?.raw || ''])
    )
  };
}
