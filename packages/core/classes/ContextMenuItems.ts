import { v4 as uuidv4 } from 'uuid';
import type MenuItem from './MenuItem';
import { generateMenuItems } from './MenuItem';

export default class ContextMenuItems {
  id = uuidv4();
  items: MenuItem[] = [];

  constructor(items?: (arg: unknown) => MenuItem[], context?: unknown) {
    if (items) {
      this.items = generateMenuItems(items(context));
    }
  }

  add(contextMenuItems: ContextMenuItems) {
    if (contextMenuItems instanceof ContextMenuItems) {
      this.items.push(...contextMenuItems.items);
    }
  }
}
