import { generateMenuItems } from './MenuItem';

export default class ContextMenu {
    defaultItems = [];
    activeItems;
    #core = null;
    constructor (core) {
      this.#core = core;
      this.activeItems = this.defaultItems;
    }

    addDefaultItems (items) {
      this.defaultItems.push(...generateMenuItems(items));
    }

    getActiveItems () {
      return this.activeItems;
    }

    setActiveItems (items) {
      if (items) {
        items = generateMenuItems(items);
      }
      return (this.activeItems = items || this.defaultItems);
    }
}
