import ContextMenuItems from './ContextMenuItems';

export default class ContextMenu {
  defaultItems = new ContextMenuItems();
  activeItems;
  #core = null;

  constructor (core) {
    this.#core = core;
    this.activeItems = this.defaultItems;
  }

  addDefaultItems (contextMenuItems) {
    this.defaultItems.add(contextMenuItems);
  }

  getActiveItems () {
    return this.activeItems;
  }

  setActiveItems (contextMenuItems) {
    return (this.activeItems = contextMenuItems || this.defaultItems);
  }

  get core () {
    return this.#core;
  }
}
