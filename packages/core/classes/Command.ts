import { camelCase } from 'change-case';

interface CommandOptions {
  name: string | string[];
  description: string;
  args: ArgumentInfo[];
  action: (...args: unknown[]) => unknown;
}
export default class CommandContainer {
  name: string[];
  description: string;
  args: ArgumentInfo[] = [];
  action;
  constructor({ name, description, args, action }: CommandOptions) {
    this.name = ([] as string[]).concat(name);
    this.description = description;
    this.args = args || this.args;
    this.action = action;
  }

  // action(...args: unknown[]) {
  //   return this._action(...args);
  // }
}

export function generateCommands(commands: CommandOptions[]) {
  return commands.map(command => new CommandContainer(command));
}

export interface ParsedInput {
  args: {
    [key: number]: unknown;
  };
  kwargs: {
    [key: string]: unknown;
  };
  unresolved: {
    args: {
      [key: number]: unknown;
    };
    kwargs: {
      [key: string]: unknown;
    };
  };
}

export function parseParsedCommand(
  command: CommandOptions,
  parsedInput: ParsedInput
) {
  return command.args.reduce(
    (result, arg) => {
      const name = ([] as string[]).concat(arg.name);
      if (name.length < 1) {
        name.push(`argument-${arg.index}`);
      }
      const primaryArgName = camelCase(arg.name[0]);

      if (
        'index' in arg &&
        arg.index !== undefined &&
        Number(arg.index) in parsedInput.args
      ) {
        // has index
        const index = arg.index;
        let value: unknown | boolean = parsedInput.args[Number(index)];
        value = value === undefined ? true : value;
        result[Number(index)] = value;
        result.unresolved[Number(index)] =
          parsedInput.unresolved.args[Number(index)];
        result[String(primaryArgName)] = value;
        result.unresolved[String(primaryArgName)] =
          parsedInput.unresolved.args[Number(index)];
      }
      name.forEach(name => {
        if (name in parsedInput.kwargs) {
          const value = parsedInput.kwargs[String(name)];
          result[String(primaryArgName)] = value === undefined ? true : value;
          result.unresolved[String(primaryArgName)] =
            parsedInput.kwargs[String(name)] === undefined ? true : value;
          // if (arg.index !== undefined) {
          //   result[Number(arg.index)] = value;
          // }
        }
      });

      return result;
    },
    { unresolved: {} } as {
      unresolved: {
        args: {
          [key: number]: unknown;
        };
        [key: string]: unknown;
        [index: number]: unknown;
      };
      [key: string]: unknown;
    }
  );
}

export class ArgumentInfo {
  name;
  index;
  flag;
  description;

  constructor({
    name,
    index,
    flag,
    description
  }: {
    name: string | string[];
    index?: number;
    flag?: string;
    description?: string;
  }) {
    this.name = ([] as string[]).concat(name);
    this.index = index;
    this.flag = flag;
    this.description = description;
  }
}
