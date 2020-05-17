
import { Subject, ReplaySubject } from 'rxjs';
import { camelCase } from 'change-case';
import commandBucket from '../../services/commandBucket';

import { generateCommands, parseParsedCommand } from '../Command';
import Logger from '../Logger';
import Config from '../Config';
import { ITEM_META } from '../FileSystem/Item';
import ConsoleInterface from '../ConsoleInterface/WebWorkbench';

import changelogContent from '../../../../CHANGELOG.md';
import commands from './commands';
import imprintContent from './content/imprint.md';
import disclaimerContent from './content/disclaimer.md';

import { CONFIG_DEFAULTS, CONFIG_NAME } from './utils';
import { TYPE as STORAGE_TYPE } from '@/web-workbench/utils/storage';
import { SYMBOL } from '@/web-workbench/utils/symbols';
import { FONT_FAMILES, DEFAULT_FONT_SIZE } from '@/web-workbench/disks/workbench13/utils';

export default class Core {
  static VERSION = process.env.WB_VERSION || '0.0.0';

  get version () {
    return Core.VERSION;
  }

  static NAME = 'web-workbench';

  #events = new Subject();
  #errorObserver = new Subject()
  #setupComplete = false;
  #ready = new ReplaySubject(0);
  #modules = {};
  #consoleInterface = new ConsoleInterface(this);
  #logger = new Logger({
    core: this,
    debug: false,
    consoleInterface: this.#consoleInterface
  });

  executionCounter = 0;

  addExecution () {
    this.executionCounter++;
    return () => {
      this.executionCounter--;
    };
  }

  #config = new Config(CONFIG_NAME, STORAGE_TYPE.SESSION, CONFIG_DEFAULTS);

  constructor () {
    this.log(`${Core.NAME}; ${Core.VERSION}`);
  }

  get events () {
    return this.#events;
  }

  async setup () {
    if (this.#setupComplete) {
      console.warn('Setup is complete!');
      return this;
    }
    this.#setupComplete = true;
    commandBucket.add(generateCommands(commands({ core: this })));

    await this.#config.ready;
    this.config.setDefaults(CONFIG_DEFAULTS);

    const modules = Object.values(this.#modules);
    await Promise.all(modules.map(module => Promise.resolve(module.beforeSetup())));
    await Promise.all(modules.map(module => Promise.resolve(module.setup())));

    this.createContent();

    this.#ready.next(this);
    return this;
  }

  destroy () {
    commandBucket.clear();
  }

  createContent () {
    const fs = this.modules.files.fs;

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

    Promise.all(files.map(({ id, name, content, position, fontFamily, fontSize }) => {
      return fs.createRootFile(id, name, {
        openMaximized: true,
        type: 'markdown',
        content,
        fontFamily: fontFamily || FONT_FAMILES.SansSerif.Arial,
        fontSize: fontSize || DEFAULT_FONT_SIZE
      }, {
        meta: [
          [
            ITEM_META.POSITION, position
          ],
          [
            ITEM_META.IGNORE_SYMBOL_REARRANGE, true
          ],
          [
            ITEM_META.SYMBOL, SYMBOL.LARGE_NOTE_RICH
          ]
        ]
      });
    })).catch((err) => {
      throw new Error(err);
    });
  }

  // Module

  addModule (Module, options) {
    const module = new Module(Object.assign({ core: this }, options));
    this.#modules[camelCase(module.constructor.NAME)] = module;
  }

  async removeModule (module) {
    await module.destroy();
    delete this.#modules[module.constructor.NAME];
  }

  // Commands

  executeCommands (commands) {
    if (commands.length > 0) {
      const command = commands.shift();
      return this.executeCommand(command).then(() => {
        return this.executeCommands(commands);
      });
    }
  }

  // eslint-disable-next-line complexity
  async executeCommand (input, options) {
    if (typeof input === 'string') {
      input = input.replace(/(.*[^\\])\n(\S*)/gm, '$1\\n$2');
    }
    options = Object.assign({ show: false, commandBucket, core: this, logger: this.logger }, options);

    const messages = [];
    if (options.message) {
      messages.push(...messages.concat(options.message));
    }
    const show = options.show;
    options.message = (message) => {
      if (show) {
        messages.push(...[].concat(message));
      }
    };

    let result;
    try {
      if (input) {
        const parsedInput = await this.modules.parser.parseCommand(input);

        if (options.commandBucket.has(parsedInput.command)) {
          result = await executeCommandBucket(input, parsedInput, options.commandBucket, options);
        } else if (commandBucket.has(parsedInput.command)) {
          result = await executeCommandBucket(input, parsedInput, commandBucket, options);
        } else if (this.modules.parser.isMathValue(input)) {
          result = await this.modules.parser.parseMath(input);
        } else if (/^\w+$/.test(input)) {
          // TODO: Methoden oder variablen aufruf aufruf
          console.warn(`can\\'t use variable or method "${input}"`);
        }
      }
    } catch (error) {
      let err = error;
      if (Array.isArray(error)) {
        err = new Error(error[error.length - 1]);
      }
      this.#errorObserver.next(err);
    }

    if (result !== undefined && result !== 'undefined' && typeof result === 'string' && options.show && messages.length < 1) {
      messages.push(result);
    }
    messages.forEach(message => options.logger.add(message, { type: Logger.TYPE.OUTPUT }));

    return result;
  }

  log (message) {
    this.#logger.add(message, {
      namespace: 'Core'
    });
  }

  get consoleInterface () {
    return this.#consoleInterface;
  }

  get errorObserver () {
    return this.#errorObserver;
  }

  get ready () {
    return this.#ready;
  }

  get config () {
    return this.#config;
  }

  get logger () {
    return this.#logger;
  }

  get modules () {
    return this.#modules;
  }
}

async function executeCommandBucket (input, parsedInput, commandBucket, options) {
  const command = commandBucket.get(parsedInput.command);
  const show = options.show;
  const result = await command.action(parseParsedCommand(command, parsedInput), Object.assign({ command: parsedInput.command, commandValue: parsedInput.commandValue, commandArgs: parsedInput.args }, options));

  if (show && options.showCommand) {
    options.logger.add('> ' + input, { type: Logger.TYPE.OUTPUT });
  }
  return result;
}
