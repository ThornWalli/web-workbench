import type { Reactive } from 'vue';
import commandBucket from '../services/commandBucket';
import type CommandContainer from './Command';
import { generateCommands } from './Command';
import type ContextMenu from './ContextMenu';
import ContextMenuItems from './ContextMenuItems';
import type Core from './Core';
import type { MenuItemOption } from './MenuItem';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContextMenuItemsFactory = (options: any) => MenuItemOption[];
export type ContextMenuDescriptor =
  | Reactive<ContextMenu | ContextMenuItems>
  | ContextMenuItems
  | ContextMenuItemsFactory;
export interface ConstructorArgs {
  name: string;
  config?: { [key: string]: unknown };
  commands?: CallableFunction | CommandContainer[];
  contextMenu?: ContextMenuDescriptor;
  core: Core;
}

export default class Module implements ConstructorArgs {
  name: string;
  commands?: CallableFunction | CommandContainer[];
  contextMenu?: ContextMenuDescriptor;
  config = {};
  core;

  constructor({
    name,
    config = {},
    commands,
    contextMenu,
    core
  }: ConstructorArgs) {
    this.name = name;
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
      this.core.modules.windows?.contextMenu?.addDefaultItems(this.contextMenu);
    }
  }

  setup() {
    this.log(this.name);
  }

  destroy() {
    if (Array.isArray(this.commands)) {
      commandBucket.remove(this.commands);
    }
  }

  log(message: string) {
    this.core.logger.add(message, { namespace: this.name });
  }
}
