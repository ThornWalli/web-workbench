import { Subject } from 'rxjs';
import { markRaw } from 'vue';

import Module from '../../Module';
import { SYMBOL } from '../../../utils/symbols';
import SymbolWrapper, { FileSystemSymbolWrapper } from '../../SymbolWrapper';
import Event from '../../Event';
import { SVG_SYMBOL } from '../../../utils/svgs';
import contextMenu from './contextMenu';
import commands from './commands';

import '../../../assets/css/symbols.pcss';
import { CONFIG_DEFAULTS } from './utils';

export default class Symbols extends Module {
  static NAME = 'Symbols';
  #events = new Subject();
  #symbols = new Map();
  #wrappers = new Map();
  #wrappersObservable = {};

  hasSelectedItems = false;

  #activeWrapper;
  #defaultWrapper;

  activeWrapper;
  defaultWrapper;

  primaryWrapper;
  secondaryWrapper;

  constructor(options) {
    const { core } = Object.assign({ core: null }, options);
    super({ config: CONFIG_DEFAULTS, commands, contextMenu, core });
  }

  addWrapper(wrapper) {
    wrapper = markRaw(wrapper);
    this.#wrappers.set(wrapper.id, wrapper);
    this.#wrappersObservable[wrapper.id] = wrapper;
    wrapper.events.subscribe(this.onEventWrapper.bind(this));
    return wrapper.id;
  }

  onEventWrapper({ name, value }) {
    const { wrapper } = value;
    if (name === 'selectItem' || name === 'unselectItem') {
      this.hasSelectedItems = wrapper.selectedItems.value.length > 0;
      this.#events.next(new Event('hasSelectedItems', this.hasSelectedItems));
    }
  }

  removeWrapper(id) {
    if (typeof id !== 'string') {
      id = id.id;
    }
    this.#wrappers.delete(id);
    delete this.#wrappersObservable[String(id)];
  }

  getActiveWrapper(onlyWindow) {
    const activeWindow =
      this.core.modules.windows.contentWrapper.getActiveWindow();
    if (activeWindow && activeWindow.symbolWrapper) {
      return activeWindow.symbolWrapper;
    } else if (!onlyWindow) {
      return this.activeWrapper;
    }
    return null;
  }

  getSelectedItems() {
    return Array.from(this.#wrappers.values()).reduce((result, wrapper) => {
      result.push(
        ...wrapper.selectedItems.value.map(selectedItem =>
          wrapper.get(selectedItem)
        )
      );
      return result;
    }, []);
  }

  clearSelectedItems() {
    return Array.from(this.#wrappers.values()).forEach(wrapper => {
      wrapper.clearSelectedItems();
    });
  }

  async addFileSystemWrapper(fsItem, root) {
    const fsSymbolWrapper = new FileSystemSymbolWrapper(this.core, null, root);
    await fsSymbolWrapper.setup(fsItem);
    return this.addWrapper(fsSymbolWrapper);
  }

  async setup() {
    await this.loadCoreSymbols();
    this.setDefaultWrapper(
      await this.addFileSystemWrapper(this.core.modules.files.fs.root, true)
    );
  }

  loadCoreSymbols() {
    return Promise.all(
      Object.values(SYMBOL).map(async name => {
        return this.#symbols.set(name, await SVG_SYMBOL[String(name)]());
      })
    );
  }

  get(id) {
    return this.#wrappers.get(id);
  }

  setDefaultWrapper(id) {
    this.#defaultWrapper = id;
    this.primaryWrapper =
      this.secondaryWrapper =
      this.activeWrapper =
      this.defaultWrapper =
        this.symbolWrappers.get(id);
  }

  getDefaultWrapper() {
    return this.defaultWrapper;
  }

  getPrimaryWrapper() {
    return this.primaryWrapper || this.defaultWrapper;
  }

  getSecondaryWrapper() {
    return this.secondaryWrapper || this.defaultWrapper;
  }

  setPrimaryWrapper(id) {
    if (id instanceof SymbolWrapper) {
      id = id.id;
    }
    this.primaryWrapper = this.symbolWrappers.get(id);
    this.#events.next(new Event('setPrimaryWrapper', this.getPrimaryWrapper()));
  }

  setSecondaryWrapper(id) {
    if (id instanceof SymbolWrapper) {
      id = id.id;
    }
    this.secondaryWrapper = this.symbolWrappers.get(id);
    this.#events.next(new Event('setSecondaryWrapper', this.secondaryWrapper));
  }

  setActiveWrapper(id) {
    if (id instanceof SymbolWrapper) {
      id = id.id;
    }
    let activeWrapper = this.symbolWrappers.get(this.#activeWrapper);
    if (id !== this.#activeWrapper) {
      this.#activeWrapper = id;
      this.activeWrapper = this.symbolWrappers.get(this.#activeWrapper);
      activeWrapper =
        this.activeWrapper || this.symbolWrappers.get(this.#defaultWrapper);
      this.#events.next(new Event('setActiveWrapper', activeWrapper));
    }
    return activeWrapper;
  }

  addSymbol(name, symbol) {
    this.#symbols.set(name, symbol);
  }

  removeSymbol(name) {
    this.#symbols.delete(name);
  }

  get wrappersObservable() {
    return this.#wrappersObservable;
  }

  get events() {
    return this.#events;
  }

  get symbols() {
    return this.#symbols;
  }

  get symbolWrappers() {
    return this.#wrappers;
  }
}
