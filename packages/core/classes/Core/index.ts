import { Subject, ReplaySubject } from 'rxjs';
import { camelCase } from 'change-case';

import type { CommandBucket } from '../../services/commandBucket';
import commandBucket from '../../services/commandBucket';

import {
  generateCommands,
  parseParsedCommand,
  type CommandResult
} from '../Command';
import Logger from '../Logger';
import Config from '../Config';
import ConsoleInterface from '../ConsoleInterface/WebWorkbench';

import { TYPE as STORAGE_TYPE } from '../../utils/storage';
import commands from './commands';

import { CONFIG_NAME } from './utils';

import { useRuntimeConfig } from '#imports';
import { markRaw } from 'vue';

import type Module from '../Module';
import type { IModule } from '../Module';
import type SessionStorage from '../Storage/SessionStorage';
import type { ParseCallbackOptions } from '../BasicInterpreter';
import {
  ITEM_META,
  type ItemRawDefinition,
  type RawListData
} from '../FileSystem/types';
import type { DiskList } from '../modules/Files/types';
import type { SymbolDescription } from '../modules/Symbols/types';

const { version } = useRuntimeConfig().public;

export interface CoreModules {
  [key: string]: Module;
}

export default class Core {
  static VERSION = version || '0.0.0';

  get version() {
    return Core.VERSION;
  }

  static NAME = 'web-workbench';

  setupComplete = false;

  events = markRaw(new Subject());
  errorObserver = markRaw(new Subject<Error>());
  ready = markRaw(new ReplaySubject(0));
  modules: Partial<CoreModules> = {};
  consoleInterface = new ConsoleInterface(this);
  logger = new Logger({
    core: this,
    debug: false,
    consoleInterface: this.consoleInterface
  });

  executionCounter = 0;

  addExecution() {
    this.executionCounter++;
    return () => {
      this.executionCounter--;
    };
  }

  config = new Config<SessionStorage<RawListData[]>>(
    CONFIG_NAME,
    STORAGE_TYPE.SESSION
  );

  constructor() {
    this.log(`${Core.NAME}; ${Core.VERSION}`);
  }

  async setup({
    symbols,
    disks
  }: {
    symbols?: SymbolDescription[];
    disks?: DiskList;
  } = {}) {
    if (this.setupComplete) {
      console.warn('Setup is complete!');
      return this;
    }
    this.setupComplete = true;
    commandBucket.add(generateCommands(commands({ core: this })));

    await this.config.ready;

    const modules = Object.values(this.modules);
    await Promise.all(
      modules.map(module => Promise.resolve(module?.beforeSetup()))
    );
    await Promise.all(modules.map(module => Promise.resolve(module?.setup())));

    if (disks) {
      this.modules.files?.addDisks(disks);
    }

    if (symbols) {
      this.modules.symbols?.addSymbols(symbols);
    }

    this.ready.next(this);
    return this;
  }

  destroy() {
    commandBucket.clear();
  }

  // #region Module

  addModule(ModuleClass: typeof Module, options?: IModule) {
    const module: Module = new ModuleClass({
      core: this,
      ...options
    });
    this.modules[camelCase(module.name)] = module;
  }

  async removeModule(module: Module) {
    await module.destroy();

    // delete this.modules[module.name];
    Reflect.deleteProperty(this.modules, module.name);
  }

  // #endregion

  // #region Commands

  executeCommands(commands: string[]): unknown {
    const command = commands.shift();
    if (command) {
      return this.executeCommand(command).then(() => {
        return this.executeCommands(commands);
      });
    }
  }

  // eslint-disable-next-line complexity
  async executeCommand(input: string, options?: ParseCallbackOptions) {
    if (typeof input === 'string') {
      input = input.replace(/(.*[^\\])\n(\S*)/gm, '$1\\n$2');
    }
    const show = options?.show || false;

    const messages: string[] = [];
    if (
      Array.isArray(options?.message) ||
      typeof options?.message === 'string'
    ) {
      messages.push(...messages.concat(options?.message));
    }

    // const messages: string[] = [];
    // if (options?.message) {
    //   messages.push(...messages.concat(options.message));
    // }

    const normalizeOptions: {
      show: boolean;
      commandBucket?: CommandBucket;
      core?: Core;
      logger?: Logger;
      message?: (message: string) => void;
    } = {
      commandBucket,
      core: this,
      logger: this.logger,
      show,
      ...options,
      message: (message: string) => {
        if (show) {
          let value = message;
          if (typeof message === 'string') {
            message = message.replace(/\\n/g, '\n');
            value = `"${message}"`;
          }
          messages.push(...([] as string[]).concat(value));
        }
      }
    };
    let result;
    try {
      if (input) {
        const parsedInput = await this.modules.parser?.parseCommand(input);

        if (parsedInput) {
          if (normalizeOptions.commandBucket?.has(parsedInput.command)) {
            result = await executeCommandBucket(
              input,
              parsedInput,
              normalizeOptions.commandBucket,
              normalizeOptions
            );
          } else if (commandBucket.has(parsedInput.command)) {
            result = await executeCommandBucket(
              input,
              parsedInput,
              commandBucket,
              normalizeOptions
            );
          } else if (this.modules.parser?.mathParser.validInput(input)) {
            result = await this.modules.parser.mathParser.parse(input);
          } else if (/^\w+$/.test(input)) {
            // TODO: Methoden oder variablen aufruf aufruf
            console.warn(`can\\'t use variable or method "${input}"`);
          }
        } else {
          console.warn(`can\\'t parse command "${input}"`);
        }
      }
    } catch (error: Error | unknown) {
      let err = error;
      if (Array.isArray(error)) {
        err = new Error(error[error.length - 1]);
      }
      this.errorObserver.next(err as Error);
    }

    if (
      result !== undefined &&
      result !== 'undefined' &&
      typeof result === 'string' &&
      normalizeOptions.show &&
      messages.length < 1
    ) {
      messages.push(result);
    }
    messages.forEach(message =>
      normalizeOptions.logger?.add(message, { type: Logger.TYPE.OUTPUT })
    );

    return result;
  }

  // #endregion

  // #region Others

  addRootItems(items: ItemRawDefinition[]) {
    const fs = this.modules.files?.fileSystem;
    return Promise.all(
      items.map(async ({ id, name, data, meta, items }) => {
        if (items && items.length) {
          const dirItem = await fs?.createRootDir('Press', 'Press', {
            meta: [
              [ITEM_META.WINDOW_SIDEBAR, false],
              [ITEM_META.WINDOW_SCALE, false],
              [ITEM_META.WINDOW_SCROLL_X, false],
              [ITEM_META.WINDOW_SCROLL_Y, false],
              [ITEM_META.POSITION, { x: 80, y: 320 }],
              [ITEM_META.WINDOW_SIZE, { x: 120, y: 120 }],
              [ITEM_META.IGNORE_SYMBOL_REARRANGE, true]
            ]
          });
          dirItem?.addItems(items);
          return dirItem;
        } else {
          return fs?.createRootFile(id, name, data, {
            meta: meta || []
          });
        }
      })
    ).catch(err => {
      throw new Error(err);
    });
  }

  log(message: string) {
    this.logger.add(message, {
      namespace: 'Core'
    });
  }

  // #endregion
}

async function executeCommandBucket(
  input: string,
  parsedInput: CommandResult,
  commandBucket: CommandBucket,
  options: {
    show: boolean;
    commandBucket?: CommandBucket;
    core?: Core;
    logger?: Logger;
    message?: (message: string) => void;
    showCommand?: boolean;
  }
) {
  const command = commandBucket.get(parsedInput.command);

  if (command) {
    const show = options.show;
    const parsedCommand = parseParsedCommand(command, parsedInput);
    const result = await command.action(
      parsedCommand,
      Object.assign(
        {
          command: parsedInput.command,
          commandValue: parsedInput.commandValue,
          commandArgs: parsedInput.args
        },
        options
      )
    );

    if (show && options.showCommand) {
      options.logger?.add('> ' + input, { type: Logger.TYPE.OUTPUT });
    }
    return result;
  }
}
