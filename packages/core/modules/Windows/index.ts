import { reactive, markRaw, type Reactive } from 'vue';
import Module, { type ModuleConstructorOptions } from '../../classes/Module';

import ContextMenu from '../../classes/ContextMenu';

import coreContextMenu from '../../classes/Core/contextMenu';
import WindowWrapper from '../../classes/WindowWrapper';
import Window from '../../classes/Window';
import ContextMenuItems from '../../classes/ContextMenuItems';
import contextMenu from './contextMenu';
import commands from './commands';
import { CONFIG_DEFAULTS } from './utils';
import { combineLatest } from 'rxjs';
import './types';
import type { WindowTemplate } from '@web-workbench/core/types/window';

export default class Windows extends Module {
  wrappers = markRaw(new Map<string, Reactive<WindowWrapper>>());
  contentWrapper: Reactive<WindowWrapper>;
  globalWrapper: Reactive<WindowWrapper>;
  override contextMenu: Reactive<ContextMenu>;

  constructor(options: ModuleConstructorOptions) {
    super({ config: CONFIG_DEFAULTS, commands, ...options, name: 'Windows' });

    this.contextMenu = reactive(new ContextMenu(this.core));

    const contentWrapper = this.getWrapper(
      this.addWrapper(new WindowWrapper(this.core))
    );
    if (!contentWrapper) {
      throw new Error('Content wrapper not found');
    }
    this.contentWrapper = contentWrapper;
    const globalWrapper = this.getWrapper(
      this.addWrapper(new WindowWrapper(this.core))
    );
    if (!globalWrapper) {
      throw new Error('Global wrapper not found');
    }
    this.globalWrapper = globalWrapper;

    combineLatest({
      contentWrapper: this.contentWrapper.events,
      globalWrapper: this.globalWrapper.events
    }).subscribe(event => {
      console.log('event', event);
    });
  }

  addWindow(
    data: Window | WindowTemplate,
    options: { [key: string]: unknown } = {}
  ): Window {
    let window: Window;
    if (!(data instanceof Window)) {
      window = new Window(data);
    } else {
      window = data;
    }

    options = { global: false, ...options };
    if (options.global) {
      window = this.globalWrapper.add(window, options);
    } else {
      window = this.contentWrapper.add(window, options);
    }
    window.focus();
    return window;
  }

  getWrapper(id: string) {
    return this.wrappers.get(id);
  }

  getFocusedWrapper() {
    return Array.from(this.wrappers.values())
      .map(({ models }) => models)
      .flat()
      .find(model => model.options.focused);
  }

  addWrapper(wrapper: WindowWrapper) {
    this.wrappers.set(wrapper.id, reactive(wrapper));
    return wrapper.id;
  }

  removeWrapper(id: string | WindowWrapper) {
    if (typeof id !== 'string') {
      id = id.id;
    }
    this.wrappers.delete(id);
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
