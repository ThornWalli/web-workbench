import { camelCase } from 'change-case';
import { cleanString, prepareString, removeSideSpaces } from '../utils/helper';
import StringParamterParser from './StringParameterParser';

export default class CommandParser {
  static REGEX_VALUE_RESOLVE = /[$]{3}(\d+)/;
  static REGEX_COMMAND_REPLACE = /^([a-zA-Z]+[a-zA-Z0-9_]+) (.*)$/;
  static REGEX_PARAM_KWARG = /^[-]{0,2}([\\-\w]+)=(.*)$/;
  static REGEX_PARAM_ARG = /^[-]{1,2}([\\-\w]+)$/;

  #mathParser;

  constructor(mathParser) {
    this.#mathParser = mathParser;
  }

  async parse(input) {
    const origin = input;

    let command = input;
    const match = input.match(CommandParser.REGEX_COMMAND_REPLACE);
    if (match) {
      command = match[1];
      input = match[2];
    }
    const commandValue = input;

    let args = [];
    let kwargs = {};
    let unresolved;
    if (command !== input) {
      const parseParameter = this.parseParameter(input);
      unresolved = parseParameter.unresolved;
      args = await Promise.all(parseParameter.args);
      kwargs = parseParameter.kwargs;
      await Promise.all(
        Object.keys(kwargs).map(key => {
          return kwargs[String(key)].then(
            value => (kwargs[String(key)] = value)
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

  parseParameter(input) {
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
          kwargs: {},
          args: []
        },
        kwargs: {},
        args: []
      }
    );
  }

  parseValue(value) {
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
  static extractStrings(input) {
    let record = false;
    let recordStartIndex;
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
  static extractValues(input, splitter = ' ') {
    let record = false;
    let recordStartIndex;
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

  static resolveKey(index) {
    return `$$$$$$${index}`;
  }

  static resolveValues({ params, values }) {
    return params.map(param => CommandParser.resolveValue(param, values));
  }

  static valueUnresolved(value) {
    return CommandParser.REGEX_VALUE_RESOLVE.test(value);
  }

  static resolveValue(value, values) {
    if (CommandParser.valueUnresolved(value)) {
      value = value.match(/[$]{3}(\d+)/g).reduce((result, value) => {
        return result.replace(
          value,
          values[Number(value.replace(CommandParser.REGEX_VALUE_RESOLVE, '$1'))]
        );
      }, value);

      // value = values[Number(value.replace(CommandParser.REGEX_VALUE_RESOLVE, '$1'))];
      if (/[\w]+[$%]?[ ]*\(/.test(value)) {
        return value;
      } else if (typeof value === 'string') {
        if (value === 'undefined') {
          return undefined;
        } else if (isNumericPattern(value)) {
          return value;
        } else if (isNumeric(value)) {
          return Number(value);
        } else if (!value.startsWith('"')) {
          return prepareString(value);
        }
      }
    }
    return value;
  }
}

function isNumeric(num) {
  return !isNaN(num);
}
function isNumericPattern(num) {
  return !isNaN(parseInt(num));
}
