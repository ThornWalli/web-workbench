import { Subject } from 'rxjs';
import { markRaw, type FunctionalComponent } from 'vue';

import Module from '../../Module';
import { SYMBOL } from '../../../utils/symbols';
import { ASymbolWrapper, type SymbolWrapperEvent } from '../../SymbolWrapper';
import type SymbolWrapper from '../../SymbolWrapper';
import Event from '../../Event';
import { SVG_SYMBOL } from '../../../utils/svgs';
import contextMenu from './contextMenu';
import commands from './commands';

import '../../../assets/css/symbols.pcss';
import { CONFIG_DEFAULTS } from './utils';
import type Core from '../../Core';
import type FsItemContainer from '../../FileSystem/ItemContainer';
import { FileSystemSymbolWrapper } from '../../SymbolWrapper/FileSystem';
import type SymbolItem from '../../SymbolItem';

class SymbolEvent extends Event<boolean | unknown | undefined> {}

export default class Symbols extends Module {
  static NAME = 'Symbols';

  #events = new Subject<SymbolEvent>();
  #symbols: Map<string, FunctionalComponent> = new Map();
  #wrappers: Map<string, ASymbolWrapper> = new Map();
  #wrappersObservable: { [key: string]: ASymbolWrapper } = {};

  hasSelectedItems = false;

  #activeWrapper?: string;
  #defaultWrapper?: string;

  activeWrapper?: ASymbolWrapper;
  defaultWrapper?: ASymbolWrapper;

  primaryWrapper?: ASymbolWrapper;
  secondaryWrapper?: ASymbolWrapper;

  constructor(options: { core: Core }) {
    const { core } = Object.assign({ core: null }, options);

    super({
      name: 'Symbols',
      config: CONFIG_DEFAULTS,
      commands,
      contextMenu,
      core
    });
  }

  addWrapper(wrapper: ASymbolWrapper) {
    wrapper = markRaw(wrapper);
    this.#wrappers.set(wrapper.id, wrapper);
    this.#wrappersObservable[wrapper.id] = wrapper;
    wrapper.events.subscribe(this.onEventWrapper.bind(this));
    return wrapper.id;
  }

  onEventWrapper({ name, value }: SymbolWrapperEvent) {
    if (value?.wrapper && (name === 'selectItem' || name === 'unselectItem')) {
      this.hasSelectedItems = value?.wrapper.selectedItems.value.length > 0;
      this.#events.next(
        new SymbolEvent({
          name: 'hasSelectedItems',
          value: this.hasSelectedItems
        })
      );
    }
  }

  removeWrapper(id: string | SymbolWrapper) {
    if (typeof id !== 'string') {
      id = id.id;
    }
    this.#wrappers.delete(id);
    Reflect.deleteProperty(this.#wrappersObservable, id);
  }

  getActiveWrapper(onlyWindow: boolean = false) {
    const activeWindow =
      this.core.modules.windows?.contentWrapper.getActiveWindow();
    if (activeWindow && activeWindow.symbolWrapper) {
      return activeWindow.symbolWrapper;
    } else if (!onlyWindow) {
      return this.activeWrapper;
    }
    return null;
  }

  getSelectedItems<TItem = SymbolItem>(): TItem[] {
    return Array.from(this.#wrappers.values()).reduce(
      (result: TItem[], wrapper) => {
        const selectedItems = wrapper.selectedItems.value;
        selectedItems.forEach(selectedItem => {
          const item = wrapper.get(selectedItem);
          if (item) {
            result.push(item as TItem);
          }
        });
        return result;
      },
      []
    );
  }

  clearSelectedItems() {
    return Array.from(this.#wrappers.values()).forEach(wrapper => {
      wrapper.clearSelectedItems();
    });
  }

  async addFileSystemWrapper(fsItem: FsItemContainer, root = false) {
    const fsSymbolWrapper = new FileSystemSymbolWrapper(
      this.core,
      undefined,
      root
    );
    await fsSymbolWrapper.setup(fsItem);
    return this.addWrapper(fsSymbolWrapper);
  }

  override async setup() {
    const root = this.core.modules.files?.fs.root;
    if (root) {
      await this.loadCoreSymbols();
      this.setDefaultWrapper(await this.addFileSystemWrapper(root, true));
    }
  }

  loadCoreSymbols() {
    return Promise.all(
      Object.values(SYMBOL).map(async name => {
        return this.#symbols.set(name, await SVG_SYMBOL[name]());
      })
    );
  }

  get(id: string) {
    return this.#wrappers.get(id);
  }

  setDefaultWrapper(id: string) {
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

  getPrimaryWrapper<TWrapper = ASymbolWrapper>(): TWrapper {
    return (this.primaryWrapper || this.defaultWrapper) as TWrapper;
  }

  getSecondaryWrapper<TWrapper = ASymbolWrapper>(): TWrapper {
    return (this.secondaryWrapper || this.defaultWrapper) as TWrapper;
  }

  setPrimaryWrapper(item: ASymbolWrapper | string) {
    let id: string;
    if (item instanceof ASymbolWrapper) {
      id = item.id;
    } else {
      id = item as string;
    }
    this.primaryWrapper = this.symbolWrappers.get(id);
    this.#events.next(
      new Event({ name: 'setPrimaryWrapper', value: this.getPrimaryWrapper() })
    );
  }

  setSecondaryWrapper(item: ASymbolWrapper | string) {
    let id: string;
    if (item instanceof ASymbolWrapper) {
      id = item.id;
    } else {
      id = item as string;
    }
    this.secondaryWrapper = this.symbolWrappers.get(id);
    this.#events.next(
      new Event({ name: 'setSecondaryWrapper', value: this.secondaryWrapper })
    );
  }

  setActiveWrapper(item: ASymbolWrapper | string) {
    let id: string;
    if (item instanceof ASymbolWrapper) {
      id = item.id;
    } else {
      id = item as string;
    }
    let activeWrapper = this.symbolWrappers.get(this.#activeWrapper || '');
    if (id !== this.#activeWrapper) {
      this.#activeWrapper = id;
      this.activeWrapper = this.symbolWrappers.get(this.#activeWrapper);
      activeWrapper =
        this.activeWrapper ||
        this.symbolWrappers.get(this.#defaultWrapper || '');
      this.#events.next(
        new Event({ name: 'setActiveWrapper', value: activeWrapper })
      );
    }
    return activeWrapper;
  }

  addSymbol(name: string, symbol: FunctionalComponent) {
    this.#symbols.set(name, symbol);
  }

  removeSymbol(name: string) {
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
