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

import { SYMBOL } from '../../utils/symbols';
import { TYPE as STORAGE_TYPE } from '../../utils/storage';
import commands from './commands';

import { CONFIG_NAME } from './utils';

import { useRuntimeConfig } from '#imports';
import { markRaw } from 'vue';

import type Module from '../Module';
import type { IModule } from '../Module';
import type FileSystem from '../FileSystem';
import type SessionStorage from '../Storage/SessionStorage';
import type { ParseCallbackOptions } from '../BasicInterpreter';
import { ITEM_META, type RawListData } from '../FileSystem/types';
// import type Module from '../Module';

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

  value: Core;
  constructor() {
    this.value = this;
    this.log(`${Core.NAME}; ${Core.VERSION}`);
  }

  async setup() {
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

    if (this.modules.files) {
      await createFiles(this.modules.files.fs);
    }

    this.ready.next(this);
    return this;
  }

  destroy() {
    commandBucket.clear();
  }

  // Module

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

  // Commands

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
          } else if (this.modules.parser?.isMathValue(input)) {
            result = await this.modules.parser.parseMath(input);
          } else if (/^\w+$/.test(input)) {
            // TODO: Methoden oder variablen aufruf aufruf
            console.warn(`can\\'t use variable or method "${input}"`);
          }
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

  log(message: string) {
    this.logger.add(message, {
      namespace: 'Core'
    });
  }
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

async function createFiles(fs: FileSystem) {
  const { FONT_FAMILES, DEFAULT_FONT_SIZE } = await import(
    '@web-workbench/disk-workbench13/documentEditor'
  );

  const [changelogContent, imprintContent, disclaimerContent] = (
    await Promise.all([
      import('../../../../CHANGELOG.md?raw'),
      import('./content/imprint.md?raw'),
      import('./content/disclaimer.md?raw')
    ])
  ).map(module => module.default || module);

  await fs.createRootFile('Cuby_Generator.link', 'Cuby Generator', null, {
    meta: [
      [ITEM_META.POSITION, { x: 236, y: 394 }],
      [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
      [ITEM_META.WEB_URL, 'https://cuby.lammpee.de'],
      [ITEM_META.SYMBOL, SYMBOL.CUBY]
    ]
  });
  await fs.createRootFile('Nuxt_Booster.link', 'Nuxt Booster', null, {
    meta: [
      [ITEM_META.POSITION, { x: 357, y: 378 }],
      [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
      [ITEM_META.WEB_URL, 'https://basics.github.io/nuxt-booster/'],
      [ITEM_META.SYMBOL, SYMBOL.NUXT_BOOSTER]
    ]
  });
  await fs.createRootFile(
    'Vue_Semantic_Structure.link',
    'Vue Semantic Structure',
    null,
    {
      meta: [
        [ITEM_META.POSITION, { x: 222, y: 275 }],
        [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
        [ITEM_META.WEB_URL, 'https://basics.github.io/vue-semantic-structure/'],
        [ITEM_META.SYMBOL, SYMBOL.VUE_SEMANTIC_STRUCTURE]
      ]
    }
  );
  await fs.createRootFile('Github.link', 'Github', null, {
    meta: [
      [ITEM_META.POSITION, { x: 159, y: 386 }],
      [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
      [ITEM_META.WEB_URL, 'https://github.com/ThornWalli/web-workbench'],
      [ITEM_META.SYMBOL, SYMBOL.GITHUB]
    ]
  });

  const files = [
    {
      id: 'Imprint.md',
      name: 'Imprint',
      content: imprintContent,
      position: { x: 0, y: 390 },
      fontFamily: FONT_FAMILES.Monospace['Courier New'],
      fontSize: 14
    },
    {
      id: 'Disclaimer.md',
      name: 'Disclaimer',
      content: disclaimerContent,
      position: { x: 80, y: 390 },
      fontFamily: FONT_FAMILES.Monospace['Courier New'],
      fontSize: 14
    },
    {
      id: 'Changelog.md',
      name: 'Changelog',
      content: changelogContent,
      position: { x: 0, y: 305 },
      fontFamily: FONT_FAMILES.Monospace['Courier New'],
      fontSize: 14
    }
  ];

  const pressFsItem = await fs.createRootDir('Press', 'Press', {
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
  pressFsItem.addItems([
    {
      id: 'Amiga-News.link',
      name: 'Amiga-News.de',
      meta: [
        [
          ITEM_META.WEB_URL,
          'https://www.amiga-news.de/de/news/AN-2022-07-00094-DE.html'
        ],
        [ITEM_META.SYMBOL, SYMBOL.LARGE_NOTE_RICH],
        [ITEM_META.POSITION, { x: 10, y: 10 }]
      ]
    }
  ]);

  return Promise.all(
    files.map(({ id, name, content, position, fontFamily, fontSize }) => {
      return fs.createRootFile(
        id,
        name,
        {
          openMaximized: true,
          type: 'markdown',
          content,
          fontFamily: fontFamily || FONT_FAMILES.SansSerif.Arial,
          fontSize: fontSize || DEFAULT_FONT_SIZE
        },
        {
          meta: [
            [ITEM_META.POSITION, position],
            [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
            [ITEM_META.SYMBOL, SYMBOL.LARGE_NOTE_RICH]
          ]
        }
      );
    })
  ).catch(err => {
    throw new Error(err);
  });
}
