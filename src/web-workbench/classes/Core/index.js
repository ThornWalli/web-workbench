
import { Subject, ReplaySubject } from 'rxjs';
import { camelCase } from 'change-case';
import Logger from '../Logger';
import { generateCommands, parseParsedCommand } from '../Command';

import commandBucket from '../../services/commandBucket';
import Config from '../Config';
import { ITEM_META } from '../FileSystem/Item';
import commands from './commands';

import imprintContent from './content/imprint.md';
import disclaimerContent from './content/disclaimer.md';

// import imprintContent from '!!raw-loader!./content/imprint.md';
// import disclaimerContent from '!!raw-loader!./content/disclaimer.md';
import { TYPE as STORAGE_TYPE } from '@/web-workbench/utils/storage';
import { SYMBOL } from '@/web-workbench/utils/symbols';

export const BOOT_SEQUENCE = {
  SEQUENCE_1: 0,
  SEQUENCE_2: 1,
  SEQUENCE_3: 2,
  SEQUENCE_4: 3,
  SEQUENCE_5: 4
};

export const CONFIG_NAMES = {
  SCREEN_1084_FRAME: 'core_screen1084Frame',
  SCREEN_SCANLINES: 'core_screenScanlines',
  BOOT_WITH_SEQUENCE: 'core_bootWithSequence',
  BOOT_WITH_WEBDOS: 'core_bootWithWebDos'
};

export const CONFIG_DEFAULTS = {
  [CONFIG_NAMES.SCREEN_1084_FRAME]: true,
  [CONFIG_NAMES.SCREEN_SCANLINES]: false,
  [CONFIG_NAMES.BOOT_WITH_SEQUENCE]: false,
  [CONFIG_NAMES.BOOT_WITH_WEBDOS]: false
};

const CONFIG_NAME = 'web_workbench_CONFIG';

export default class Core {
  static VERSION = '0.0.0';
  static NAME = 'web-workbench';

  #events = new Subject();
  #errorObserver = new Subject()
  #setupComplete = false;
  #ready = new ReplaySubject(0);
  #modules = {};
  #logger = new Logger(this, {
    debug: false
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
        position: { x: 0, y: 390 }
      },
      {
        id: 'Disclaimer.md',
        name: 'Disclaimer',
        content: disclaimerContent,
        position: { x: 80, y: 390 }
      }
    ];

    Promise.all(files.map(({ id, name, content, position }) => {
      return fs.createRootFile(id, name, {
        openMaximized: true,
        type: 'markdown',
        content
      }, {
        meta: [
          [
            ITEM_META.POSITION, position
          ],
          [
            ITEM_META.IGNORE_REARRANGE, true
          ],
          [
            ITEM_META.SYMBOL, SYMBOL.NOTE
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

    if (options.show && messages.length < 1) {
      messages.push(result);
    }
    messages.forEach(message => options.logger.add(message, { type: Logger.TYPE.OUTPUT }));

    return result;
  }

  log (message) {
    this.#logger.add(message, {
      namespace: Core.name
    });
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
