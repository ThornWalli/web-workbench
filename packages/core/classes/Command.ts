import type Core from '../classes/Core';
import { camelCase } from 'change-case';
import type { Table } from '../utils/console';
import type Logger from './Logger';

export type CommandArgValue = string | number | boolean | null | undefined;
export interface CommandKWargs {
  [key: string]: CommandArgValue;
}

export interface CommandResult {
  origin: CommandArgValue;
  unresolved: {
    args: string[];
    kwargs: CommandKWargs;
  };
  args: CommandArgValue[];
  kwargs: CommandKWargs;
  command: string;
  commandValue: string;
}

export function defineCommands<TOptions>(
  commands: (options: TOptions) => CommandOption[]
) {
  return (options: TOptions) => commands(options);
}

export interface CommandOptions<
  TActionOptionsRoot = ActionOptionsArgument,
  TActionReturnRoot = unknown
> extends Record<string, unknown> {
  name: string | string[];
  description: string;
  args: ArgumentInfo[];
  action<TData = { [key: string]: unknown }>(
    data: TData,
    options: TActionOptionsRoot
  ): Promise<TActionReturnRoot>;
}

export interface CommandOption {
  name: string | string[];
  description?: string;
  args?: ArgumentInfo[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (data: any, options: ActionOptionsArgument) => Promise<any>;
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
}

export function generateCommands(commands: CommandWrapper[]) {
  return commands.map(command => new CommandContainer(command));
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
  parsedInput: CommandResult
) {
  return command.args.reduce<{
    [key: string]: CommandArgValue | { [key: string]: CommandArgValue };
    unresolved: {
      [key: string]: CommandArgValue;
    };
  }>(
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
        let value = parsedInput.args[Number(index)];
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
          const value = parsedInput.kwargs[name];
          result[primaryArgName] = value === undefined ? true : value;
          result.unresolved[primaryArgName] =
            parsedInput.kwargs[String(name)] === undefined ? true : value;
          // if (arg.index !== undefined) {
          //   result[Number(arg.index)] = value;
          // }
        }
      });

      return result;
    },
    { unresolved: {} }
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
