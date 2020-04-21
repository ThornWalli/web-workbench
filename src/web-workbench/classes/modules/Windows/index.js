
import Module from '../../Module';

import ContextMenu from '../../ContextMenu';

import coreContextMenu from '../../Core/contextMenu';
import WindowWrapper from '../../WindowWrapper';
import Window from '../../Window';
import contextMenu from './contextMenu';
import commands from './commands';

export const WINDOW_POSITION = {
  CENTER: 0,
  ORDER_HORIZONTAL: 1,
  ORDER_VERTICAL: 2,
  ORDER_DIAGONAL_LEFT: 3,
  ORDER_DIAGONAL_RIGHT: 4,
  SPLIT_HORIZONTAL: 5,
  SPLIT_VERTICAL: 6
};

export const CONFIG_NAMES = {
  SHOW_STORAGE_SPACE: 'windowsShowStorageSpace'
};

export const CONFIG_DEFAULTS = {
  [CONFIG_NAMES.SHOW_STORAGE_SPACE]: true
};

export default class Windows extends Module {
  #wrappers = new Map();
  contentWrapper;
  globalWrapper;

  contextMenu = new ContextMenu(this);

  constructor (options) {
    const { core } = Object.assign({ core: null }, options);
    super({ config: CONFIG_DEFAULTS, commands, core });

    this.contentWrapper = this.getWrapper(this.addWrapper(new WindowWrapper(core)));
    this.globalWrapper = this.getWrapper(this.addWrapper(new WindowWrapper(core)));
  }

  addWindow (window, options) {
    if (!(window instanceof Window)) {
      window = new Window(window);
    }

    if (window.componentData) {
      window.componentData.core = this.core;
    }

    options = Object.assign({ global: false, full: false, active: false }, options);
    if (options.global) {
      window = this.globalWrapper.add(window, options);
    } else {
      window = this.contentWrapper.add(window, options);
    }
    return window;
  }

  getWrapper (id) {
    return this.#wrappers.get(id);
  }

  addWrapper (wrapper) {
    this.#wrappers.set(wrapper.id, wrapper);
    return wrapper.id;
  }

  removeWrapper (id) {
    if (typeof id !== 'string') {
      id = id.id;
    }
    this.#wrappers.delete(id);
  }

  setup () {
    this.contextMenu.addDefaultItems(coreContextMenu({ core: this.core }));
    this.contextMenu.addDefaultItems(contextMenu({ core: this.core }));
  }

  clear () {
    this.contentWrapper.clear();
    this.globalWrapper.clear();
  }

  getActiveContextMenu () {
    return this.contextMenu.getActiveItems();
  }

  setActiveContextMenu (contextMenu) {
    return this.contextMenu.setActiveItems(contextMenu);
  }
}
