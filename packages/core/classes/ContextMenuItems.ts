import { v4 as uuidv4 } from 'uuid';
import type MenuItem from './MenuItem';
import { generateMenuItems } from './MenuItem';
import type { ContextMenuItemsFactory } from './Module';

export default class ContextMenuItems {
  id = uuidv4();
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
