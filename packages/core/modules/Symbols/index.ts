import { Subject } from 'rxjs';
import { markRaw } from 'vue';
import type { Raw } from 'vue';

import Module from '../../classes/Module';
import type { ModuleConstructorOptions } from '../../classes/Module';
import type { SYMBOL } from '../../utils/symbols';
import { getSymbols } from '../../utils/symbols';
import { ISymbolWrapper } from '../../classes/SymbolWrapper';
import type {
  ASymbolWrapper,
  SymbolWrapperEvent
} from '../../classes/SymbolWrapper';
import type SymbolWrapper from '../../classes/SymbolWrapper';
import Event from '../../classes/Event';
import contextMenu from './contextMenu';
import commands from './commands';

import '../../assets/css/symbols.pcss';

import type FsItemContainer from '../../classes/FileSystem/ItemContainer';
import { FileSystemSymbolWrapper } from '../../classes/SymbolWrapper/FileSystem';
import type SymbolItem from '../../classes/SymbolItem';
import './types';
import { getDefaultConfig } from './utils';
import type { SymbolDescription } from './types';

class SymbolEvent extends Event<boolean | unknown | undefined> {}

export default class Symbols extends Module {
  static NAME = 'Symbols';

  events = markRaw(new Subject<SymbolEvent>());
  symbols: Raw<Map<string, SymbolDescription>> = markRaw(new Map());
  wrappers: Raw<Map<string, ISymbolWrapper>> = markRaw(new Map());
  wrappersObservable: { [key: string]: ISymbolWrapper } = {};

  hasSelectedItems = false;

  _activeWrapper?: string;
  _defaultWrapper?: string;

  activeWrapper?: ISymbolWrapper;
  defaultWrapper?: ISymbolWrapper;

  primaryWrapper?: ISymbolWrapper;
  secondaryWrapper?: ISymbolWrapper;

  constructor(options: ModuleConstructorOptions) {
    const { core } = Object.assign({ core: null }, options);

    super({
      name: 'Symbols',
      config: getDefaultConfig(),
      commands,
      contextMenu,
      core
    });
  }

  addWrapper(wrapper: ASymbolWrapper) {
    wrapper = markRaw(wrapper);
    this.wrappers.set(wrapper.id, wrapper);
    this.wrappersObservable[wrapper.id] = wrapper;
    wrapper.events.subscribe(this.onEventWrapper.bind(this));
    return wrapper.id;
  }

  onEventWrapper({ name, value }: SymbolWrapperEvent) {
    if (value?.wrapper && (name === 'selectItem' || name === 'unselectItem')) {
      this.hasSelectedItems = value?.wrapper.selectedItems.value?.length > 0;
      this.events.next(
        new SymbolEvent({
          name: 'hasSelectedItems',
          value: this.hasSelectedItems
        })
      );
    }
  }

  getWrapper<T>(id: string | SymbolWrapper) {
    if (typeof id !== 'string') {
      id = id.id;
    }
    return this.wrappers.get(id) as Raw<T> | undefined;
  }

  removeWrapper(id: string | SymbolWrapper) {
    if (typeof id !== 'string') {
      id = id.id;
    }
    this.wrappers.delete(id);
    Reflect.deleteProperty(this.wrappersObservable, id);
  }

  getActiveWrapper(onlyWindow: boolean = false) {
    const activeWindow =
      this.core.modules.windows?.contentWrapper.getActiveWindow();
    if (activeWindow && activeWindow.componentData?.symbolWrapper) {
      return activeWindow.componentData?.symbolWrapper;
    } else if (!onlyWindow) {
      return this.activeWrapper;
    }
    return null;
  }

  getSelectedItems<TItem = SymbolItem>(): TItem[] {
    return Array.from(this.wrappers.values()).reduce(
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
    return Array.from(this.wrappers.values()).forEach(wrapper => {
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
      this.addSymbols(await getSymbols());
      this.setDefaultWrapper(await this.addFileSystemWrapper(root, true));
    }
  }

  get(id: string) {
    return this.wrappers.get(id);
  }

  setDefaultWrapper(id: string) {
    this._defaultWrapper = id;
    const wrapper = this.wrappers.get(id);
    if (wrapper) {
      this.primaryWrapper = wrapper;
      this.secondaryWrapper = wrapper;
      this.activeWrapper = wrapper;
      this.defaultWrapper = wrapper;
    }
  }

  getDefaultWrapper() {
    return this.defaultWrapper;
  }

  getPrimaryWrapper<TWrapper = ISymbolWrapper>(): TWrapper {
    return (this.primaryWrapper || this.defaultWrapper) as TWrapper;
  }

  getSecondaryWrapper<TWrapper = ISymbolWrapper>(): TWrapper {
    return (this.secondaryWrapper || this.defaultWrapper) as TWrapper;
  }

  setPrimaryWrapper(item?: ISymbolWrapper | string | null) {
    if (item) {
      let id: string;
      if (item instanceof ISymbolWrapper) {
        id = item.id;
      } else {
        id = item as string;
      }
      this.primaryWrapper = this.wrappers.get(id);
    } else {
      this.primaryWrapper = undefined;
    }
    this.events.next(
      new Event({ name: 'setPrimaryWrapper', value: this.getPrimaryWrapper() })
    );
  }

  setSecondaryWrapper(item?: ISymbolWrapper | string | null) {
    if (item) {
      let id: string;
      if (item instanceof ISymbolWrapper) {
        id = item.id;
      } else {
        id = item as string;
      }
      this.secondaryWrapper = this.wrappers.get(id);
    } else {
      this.primaryWrapper = undefined;
    }
    this.events.next(
      new Event({ name: 'setSecondaryWrapper', value: this.secondaryWrapper })
    );
  }

  setActiveWrapper(item: ISymbolWrapper | string) {
    let id: string;
    if (item instanceof ISymbolWrapper) {
      id = item.id;
    } else {
      id = item as string;
    }
    let activeWrapper = this.wrappers.get(this._activeWrapper || '');
    if (id !== this._activeWrapper) {
      this._activeWrapper = id;
      this.activeWrapper = this.wrappers.get(this._activeWrapper);
      activeWrapper =
        this.activeWrapper || this.wrappers.get(this._defaultWrapper || '');
      this.events.next(
        new Event({ name: 'setActiveWrapper', value: activeWrapper })
      );
    }
    return activeWrapper;
  }

  addSymbol(symbol: SymbolDescription) {
    this.symbols.set(symbol.key, symbol);
  }

  addSymbols(symbols: SymbolDescription[]) {
    symbols.forEach(symbol => {
      this.addSymbol(symbol);
    });
  }

  removeSymbol(name: SYMBOL) {
    this.symbols.delete(name);
  }
}
