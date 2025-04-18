import type Core from '@web-workbench/core/classes/Core';
import { camelCase } from 'change-case';
import type { Table } from '../utils/console';
import type Logger from './Logger';

export interface CommandOptions extends Record<string, unknown> {
  name: string | string[];
  description: string;
  args: ArgumentInfo[];
  action: <TActionOptions, TActionReturn>(
    ...args: TActionOptions[]
  ) => Promise<TActionReturn>;
}

export interface CommandWrapper {
  name: string | string[];
  description?: string;
  args?: ArgumentInfo[];
  action: CallableFunction;
}
export interface ActionOptionsArgument {
  commandArgs: string[];
  commandValue: string;
  message: (value: (string | Table) | (string | Table)[]) => void;
  core: Core;
  logger?: Logger;
}

// export class CommandOption<TActionOptions, TActionReturn>
//   implements CommandWrapper
// {
//   name: string | string[];
//   description: string;
//   args: ArgumentInfo[];
//   action: (...args: TActionOptions[]) => Promise<TActionReturn>;
//   constructor({
//     name,
//     description,
//     args,
//     action
//   }: {
//     name: string | string[];
//     description: string;
//     args: ArgumentInfo[];
//     action: (...args: TActionOptions[]) => Promise<TActionReturn>;
//   }) {
//     this.name = ([] as string[]).concat(name);
//     this.description = description;
//     this.args = args || [];
//     this.action = action;
//   }
//   [key: string]: unknown;
// }

export default class CommandContainer {
  name: string[];
  description?: string;
  args: ArgumentInfo[] = [];
  action;
  constructor({ name, description, args, action }: CommandWrapper) {
    this.name = ([] as string[]).concat(name);
    this.description = description;
    this.args = args || this.args;
    this.action = action;
  }

  // action(...args: unknown[]) {
  //   return this._action(...args);
  // }
}

export function generateCommands(commands: CommandWrapper[]) {
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

export interface ParsedCommand {
  command: string;
  commandValue: string;
  args: {
    [key: number]: unknown;
  };
  kwargs: {
    [key: string]: unknown;
  };
  [key: number | string]: unknown;
  unresolved: {
    args: {
      [key: number]: unknown;
    };
    kwargs: {
      [key: string]: unknown;
    };
    [key: number | string]: unknown;
  };
  origin: string;
}

export function parseParsedCommand(
  command: CommandContainer,
  parsedInput: ParsedInput
): ParsedCommand {
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
        result[index] = value;
        result.unresolved[Number(index)] =
          parsedInput.unresolved.args[Number(index)];
        result[primaryArgName] = value;
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
    { unresolved: {} } as ParsedCommand
  );
}

export class ArgumentInfo {
  name;
  index;
  flag?: string | boolean;
  description;

  constructor({
    name,
    index,
    flag,
    description
  }: {
    name: string | string[];
    index?: number;
    flag?: string | boolean;
    description?: string;
  }) {
    this.name = ([] as string[]).concat(name);
    this.index = index;
    this.flag = flag;
    this.description = description;
  }
}
