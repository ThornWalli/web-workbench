import ContextMenuItems from './ContextMenuItems';
import type Core from './Core';

export default class ContextMenu {
  defaultItems = new ContextMenuItems();
  activeItems;
  core: Core;

  constructor(core: Core) {
    this.core = core;
    this.activeItems = this.defaultItems;
  }

  addDefaultItems(contextMenuItems: ContextMenuItems) {
    this.defaultItems.add(contextMenuItems);
  }

  getActiveItems() {
    return this.activeItems;
  }

  setActiveItems(contextMenuItems: ContextMenuItems) {
    return (this.activeItems = contextMenuItems || this.defaultItems);
  }
}
