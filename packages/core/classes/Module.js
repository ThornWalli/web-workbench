import commandBucket from '../services/commandBucket';
import { generateCommands } from './Command';
import ContextMenuItems from './ContextMenuItems';

export default class Module {
  commands = [];
  contextMenu = [];
  config = {};
  core;

  constructor({ config = {}, commands, contextMenu = null, core }) {
    this.core = core;
    this.config = config;
    this.commands = commands;
    this.contextMenu = contextMenu;
  }

  beforeSetup() {
    const core = this.core;

    core.config.setDefaults(this.config);

    if (typeof this.commands === 'function') {
      this.commands = generateCommands(this.commands({ core, module: this }));
      commandBucket.add(this.commands);
    }

    if (typeof this.contextMenu === 'function') {
      this.contextMenu = new ContextMenuItems(this.contextMenu, {
        core,
        module: this
      });
      this.core.modules.windows.contextMenu.addDefaultItems(this.contextMenu);
    }
  }

  setup(core) {
    this.log(this.name);
  }

  destroy() {
    this.core.removeCommands(this.commands);
  }

  log(message) {
    this.core.logger.add(message, { namespace: this.constructor.NAME });
  }

  get name() {
    return this.constructor.NAME;
  }
}
