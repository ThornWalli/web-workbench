import { camelCase } from 'change-case';
import {
  cleanString,
  prepareString,
  removeSideSpaces
} from '../../utils/helper';
import StringParamterParser from '../legacy/StringParameterParser';
import type MathParser from '../MathParser';

type CommandArgValue = string | number | boolean | null | Promise<unknown>;
interface CommandKWargs {
  [key: string]: CommandArgValue;
}

/**
 * @deprecated
 */
export default class CommandParser {
  static REGEX_VALUE_RESOLVE = /[$]{3}(\d+)/;
  static REGEX_COMMAND_REPLACE = /^([a-zA-Z]+[a-zA-Z0-9_]+) (.*)$/;
  static REGEX_PARAM_KWARG = /^[-]{0,2}([\\-\w]+)=(.*)$/;
  static REGEX_PARAM_ARG = /^[-]{1,2}([\\-\w]+)$/;

  #mathParser;

  constructor(mathParser: MathParser) {
    this.#mathParser = mathParser;
  }

  async parse(input: string) {
    const legacyData = this.parseLegacy(input);
    return legacyData;
  }

  async parseLegacy(input: string) {
    const origin = input;

    let command = input;
    const match = input.match(CommandParser.REGEX_COMMAND_REPLACE);
    if (match) {
      command = match[1];
      input = match[2];
    }
    const commandValue = input;

    let args = [];
    let kwargs: CommandKWargs = {};
    let unresolved = {
      args: [],
      kwargs: {}
    };
    if (command !== input) {
      const parseParameter = this.parseParameter(input);
      unresolved = parseParameter.unresolved || unresolved;
      args = await Promise.all(parseParameter.args);
      kwargs = parseParameter.kwargs;
      await Promise.all(
        Object.keys(kwargs).map(key => {
          return (kwargs[key] as Promise<CommandArgValue>).then(
            value => (kwargs[key] = value)
          );
        })
      );
    }
    return {
      origin,
      unresolved,
      args,
      kwargs,
      command,
      commandValue
    };
  }

  parseParameter(input: string) {
    const params = StringParamterParser.parse(input);
    return params.reduce(
      (result, param) => {
        if (CommandParser.REGEX_PARAM_KWARG.test(param)) {
          const [, name, value] = param.match(CommandParser.REGEX_PARAM_KWARG);
          result.kwargs[camelCase(String(name))] = this.parseValue(value);
          result.unresolved.kwargs[camelCase(String(name))] =
            removeSideSpaces(value);
        } else if (CommandParser.REGEX_PARAM_ARG.test(param)) {
          result.kwargs[
            camelCase(
              String(param.replace(CommandParser.REGEX_PARAM_ARG, '$1'))
            )
          ] = Promise.resolve(true);
          result.unresolved.kwargs[
            camelCase(
              String(param.replace(CommandParser.REGEX_PARAM_ARG, '$1'))
            )
          ] = Promise.resolve(true);
        } else {
          result.args.push(this.parseValue(param));
          result.unresolved.args.push(removeSideSpaces(param));
        }
        return result;
      },
      {
        unresolved: {
          args: [],
          kwargs: {}
        },
        args: [],
        kwargs: {}
      }
    );
  }

  parseValue(value: string) {
    if (/.*(true|false).*/.test(value)) {
      return Promise.resolve(
        value.replace(/.*(true|false).*/, '$1') === 'true'
      );
    }
    if (/^".*"$/.test(value)) {
      return Promise.resolve(cleanString(value));
    }
    if (/^\d+$/.test(value)) {
      return Promise.resolve(Number(value));
    }
    if (typeof value === 'string' && / *([a-zA-Z_-]+) */.test(value)) {
      return this.#mathParser.parse(value.replace(/ *([a-zA-Z_-]+) */, '$1'));
    }
    return Promise.resolve(value);
  }

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

  static valueUnresolved(value: string | number) {
    return CommandParser.REGEX_VALUE_RESOLVE.test(String(value));
  }

  static resolveValue(value: string | number, values: string[]) {
    let resolvedValue: string | number | undefined = value;
    if (CommandParser.valueUnresolved(value)) {
      resolvedValue = String(value)
        .match(/[$]{3}(\d+)/g)
        ?.reduce((result, value) => {
          return result.replace(
            value,
            values[
              Number(value.replace(CommandParser.REGEX_VALUE_RESOLVE, '$1'))
            ]
          );
        }, String(value));

      // value = values[Number(value.replace(CommandParser.REGEX_VALUE_RESOLVE, '$1'))];
      if (/[\w]+[$%]?[ ]*\(/.test(resolvedValue || '')) {
        return resolvedValue;
      } else if (typeof resolvedValue === 'string') {
        if (resolvedValue === 'undefined') {
          return undefined;
        } else if (isNumericPattern(resolvedValue)) {
          return resolvedValue;
        } else if (isNumeric(Number(resolvedValue))) {
          return Number(value);
        } else if (!resolvedValue.startsWith('"')) {
          return prepareString(resolvedValue);
        }
      }
    }
    return resolvedValue;
  }
}

function isNumeric(num: number) {
  return !isNaN(num);
}
function isNumericPattern(num: string) {
  return !isNaN(parseInt(num));
}
