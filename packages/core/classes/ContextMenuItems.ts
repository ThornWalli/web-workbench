import type MenuItem from './MenuItem/Base';
import type { ContextMenuItemsFactory } from './Module';
import { generateMenuItems } from '../utils/menuItems';

export default class ContextMenuItems {
  id = crypto.randomUUID();
  items: MenuItem[] = [];

  constructor(factory?: ContextMenuItemsFactory, context?: unknown) {
    if (factory && context) {
      this.items = generateMenuItems(factory(context));
    }
  }

  add(contextMenuItems: ContextMenuItems) {
    if (contextMenuItems instanceof ContextMenuItems) {
      this.items.push(...contextMenuItems.items);
    }
  }
}
