import { Subject } from 'rxjs';
import Module from '../../Module';
import { SYMBOL } from '../../../utils/symbols';
import SymbolWrapper, { FileSystemSymbolWrapper } from '../../SymbolWrapper';
import Event from '../../Event';
import contextMenu from './contextMenu';
import commands from './commands';

import '../../../../assets/css/symbols.pcss';

export const ORDER_TYPE = {
  NAME: 0,
  TYPE: 1,
  CREATED_DATE: 2,
  EDITED_DATE: 3
};
export const ORDER_DIRECTION = {
  ASCENDING: 0,
  DESCENDING: 1
};

export const CONFIG_NAMES = {
  SHOW_INVISIBLE_SYMBOLS: 'symbolWrapper_showInvisibleItems',
  ORDER_TYPE: 'symbolWrapper_iconsOrderType',
  ORDER_DIRECTION: 'symbolWrapper_iconsOrderDirection'
};

export const CONFIG_DEFAULTS = {
  [CONFIG_NAMES.SHOW_INVISIBLE_SYMBOLS]: false,
  [CONFIG_NAMES.ORDER_TYPE]: ORDER_TYPE.NAME,
  [CONFIG_NAMES.ORDER_DIRECTION]: ORDER_DIRECTION.ASCENDING
};

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

  constructor (options) {
    const { core } = Object.assign({ core: null }, options);
    super({ config: CONFIG_DEFAULTS, commands, contextMenu, core });
  }

  addWrapper (wrapper) {
    this.#wrappers.set(wrapper.id, wrapper);
    this.#wrappersObservable[wrapper.id] = wrapper;
    wrapper.events.subscribe(this.onEventWrapper.bind(this));
    return wrapper.id;
  }

  onEventWrapper ({ name, value }) {
    const { wrapper } = value;
    if (name === 'selectItem' || name === 'unselectItem') {
      this.hasSelectedItems = wrapper.selectedItems.length > 0;
      this.#events.next(new Event('hasSelectedItems', this.hasSelectedItems));
    }
  }

  removeWrapper (id) {
    if (typeof id !== 'string') {
      id = id.id;
    }
    this.#wrappers.delete(id);
    delete this.#wrappersObservable[String(id)];
  }

  getActiveWrapper (onlyWindow) {
    const activeWindow = this.core.modules.windows.contentWrapper.getActiveWindow();
    if (activeWindow && activeWindow.symbolWrapper) {
      return activeWindow.symbolWrapper;
    } else if (!onlyWindow) {
      return this.activeWrapper;
    }
    return null;
  }

  getSelectedItems () {
    return Array.from(this.#wrappers.values()).reduce((result, wrapper) => {
      result.push(...wrapper.selectedItems.map(selectedItem => wrapper.get(selectedItem)));
      return result;
    }, []);
  }

  clearSelectedItems () {
    return Array.from(this.#wrappers.values()).forEach((wrapper) => {
      wrapper.clearSelectedItems();
    });
  }

  async addFileSystemWrapper (fsItem, root) {
    const fsSymbolWrapper = new FileSystemSymbolWrapper(this.core, null, root);
    await fsSymbolWrapper.setup(fsItem);
    return this.addWrapper(fsSymbolWrapper);
  }

  async setup () {
    await this.loadCoreSymbols();
    this.setDefaultWrapper(await this.addFileSystemWrapper(this.core.modules.files.fs.root, true));
  }

  loadCoreSymbols () {
    return Promise.all(Object.values(SYMBOL).map((name) => {
      return import('@/assets/svg/symbols/' + name + '.svg?vue-template').then((module) => {
        return this.#symbols.set(name, module.default);
      });
    }));
  }

  get (id) {
    return this.#wrappers.get(id);
  }

  setDefaultWrapper (id) {
    this.#defaultWrapper = id;
    this.primaryWrapper = this.secondaryWrapper = this.activeWrapper = (this.defaultWrapper = this.symbolWrappers.get(id));
  }

  getDefaultWrapper () {
    return this.defaultWrapper;
  }

  getPrimaryWrapper () {
    return (this.primaryWrapper || this.defaultWrapper);
  }

  getSecondaryWrapper () {
    return (this.secondaryWrapper || this.defaultWrapper);
  }

  setPrimaryWrapper (id) {
    if (id instanceof SymbolWrapper) {
      id = id.id;
    }
    this.primaryWrapper = this.symbolWrappers.get(id);
    this.#events.next(new Event('setPrimaryWrapper', this.getPrimaryWrapper()));
  }

  setSecondaryWrapper (id) {
    if (id instanceof SymbolWrapper) {
      id = id.id;
    }
    this.secondaryWrapper = this.symbolWrappers.get(id);
    this.#events.next(new Event('setSecondaryWrapper', this.secondaryWrapper));
  }

  setActiveWrapper (id) {
    if (id instanceof SymbolWrapper) {
      id = id.id;
    }
    let activeWrapper = this.symbolWrappers.get(this.#activeWrapper);
    if (id !== this.#activeWrapper) {
      this.#activeWrapper = id;
      this.activeWrapper = this.symbolWrappers.get(this.#activeWrapper);
      activeWrapper = this.activeWrapper || this.symbolWrappers.get(this.#defaultWrapper);
      this.#events.next(new Event('setActiveWrapper', activeWrapper));
    }
    return activeWrapper;
  }

  addSymbol (name, symbol) {
    this.#symbols.set(name, symbol);
  }

  removeSymbol (name) {
    this.#symbols.delete(name);
  }

  get wrappersObservable () {
    return this.#wrappersObservable;
  }

  get events () {
    return this.#events;
  }

  get symbols () {
    return this.#symbols;
  }

  get symbolWrappers () {
    return this.#wrappers;
  }
}

