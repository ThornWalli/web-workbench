import { reactive, markRaw, type Reactive } from 'vue';
import Module, {
  type ConstructorArgs as ModuleConstructorArgs
} from '../../Module';

import ContextMenu from '../../ContextMenu';

import coreContextMenu from '../../Core/contextMenu';
import WindowWrapper from '../../WindowWrapper';
import Window, {
  type ConstructorArgs as WindowConstructorArgs
} from '../../Window';
import ContextMenuItems from '../../ContextMenuItems';
import contextMenu from './contextMenu';
import commands from './commands';
import { CONFIG_DEFAULTS } from './utils';
import { combineLatest } from 'rxjs';

export default class Windows extends Module {
  #wrappers = new Map();
  contentWrapper;
  globalWrapper;
  override contextMenu: Reactive<ContextMenu>;

  constructor(options: ModuleConstructorArgs) {
    super({ config: CONFIG_DEFAULTS, commands, ...options, name: 'Windows' });

    this.contextMenu = reactive(new ContextMenu(this.core));

    this.contentWrapper = this.getWrapper(
      this.addWrapper(new WindowWrapper(this.core))
    );
    this.globalWrapper = this.getWrapper(
      this.addWrapper(new WindowWrapper(this.core))
    );

    combineLatest({
      contentWrapper: this.contentWrapper.events,
      globalWrapper: this.globalWrapper.events
    }).subscribe(event => {
      console.log('event', event);
    });
  }

  addWindow(
    data: WindowConstructorArgs | Window,
    options: { [key: string]: unknown } = {}
  ): Window {
    let window: Window;
    if (!(data instanceof Window)) {
      window = new Window(data);
    } else {
      window = data;
    }

    if (window.componentData) {
      window.componentData.core = markRaw(this.core);
    }

    options = { global: false, ...options };
    if (options.global) {
      window = this.globalWrapper.add(window, options);
    } else {
      window = this.contentWrapper.add(window, options);
    }
    return window;
  }

  getWrapper(id: string) {
    return this.#wrappers.get(id);
  }

  getFocusedWrapper() {
    return Array.from(this.#wrappers.values())
      .map(({ models }) => models.value)
      .flat()
      .find(model => model.options.focused);
  }

  addWrapper(wrapper: WindowWrapper) {
    this.#wrappers.set(wrapper.id, wrapper);
    return wrapper.id;
  }

  removeWrapper(id: string | WindowWrapper) {
    if (typeof id !== 'string') {
      id = id.id;
    }
    this.#wrappers.delete(id);
  }

  isContextMenu(contextMenu: ContextMenuItems) {
    return contextMenu.id === this.getActiveContextMenu().id;
  }

  override setup() {
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

  setActiveContextMenu(contextMenuItems: ContextMenuItems | null) {
    return this.contextMenu.setActiveItems(contextMenuItems);
  }
}
