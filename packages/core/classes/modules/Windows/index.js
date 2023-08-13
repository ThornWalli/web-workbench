import { reactive, markRaw } from 'vue';
import Module from '../../Module';

import ContextMenu from '../../ContextMenu';

import coreContextMenu from '../../Core/contextMenu';
import WindowWrapper from '../../WindowWrapper';
import Window from '../../Window';
import ContextMenuItems from '../../ContextMenuItems';
import contextMenu from './contextMenu';
import commands from './commands';
import { CONFIG_DEFAULTS } from './utils';

export default class Windows extends Module {
  static NAME = 'Windows';
  #wrappers = new Map();
  contentWrapper;
  globalWrapper;

  contextMenu = reactive(new ContextMenu(this));

  constructor(options) {
    const { core } = Object.assign({ core: null }, options);
    super({ config: CONFIG_DEFAULTS, commands, core });

    this.contentWrapper = this.getWrapper(
      this.addWrapper(new WindowWrapper(core))
    );
    this.globalWrapper = this.getWrapper(
      this.addWrapper(new WindowWrapper(core))
    );
  }

  addWindow(window, options) {
    if (!(window instanceof Window)) {
      window = new Window(window);
    }

    if (window.componentData) {
      window.componentData.core = markRaw(this.core);
    }

    options = Object.assign({ global: false }, options);
    if (options.global) {
      window = this.globalWrapper.add(window, options);
    } else {
      window = this.contentWrapper.add(window, options);
    }
    return window;
  }

  getWrapper(id) {
    return this.#wrappers.get(id);
  }

  addWrapper(wrapper) {
    this.#wrappers.set(wrapper.id, wrapper);
    return wrapper.id;
  }

  removeWrapper(id) {
    if (typeof id !== 'string') {
      id = id.id;
    }
    this.#wrappers.delete(id);
  }

  isContextMenu(contextMenu) {
    return contextMenu.id === this.getActiveContextMenu().id;
  }

  setup() {
    this.contextMenu.addDefaultItems(
      new ContextMenuItems(coreContextMenu, { core: this.core })
    );
    this.contextMenu.addDefaultItems(
      new ContextMenuItems(contextMenu, { core: this.core })
    );
  }

  clear() {
    this.contentWrapper.clear();
    this.globalWrapper.clear();
  }

  getActiveContextMenu() {
    return this.contextMenu.getActiveItems();
  }

  setActiveContextMenu(contextMenu) {
    return this.contextMenu.setActiveItems(contextMenu);
  }
}
