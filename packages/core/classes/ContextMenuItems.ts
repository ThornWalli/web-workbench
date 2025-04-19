import { v4 as uuidv4 } from 'uuid';
import type MenuItem from './MenuItem';
import { generateMenuItems, type MenuItemOption } from './MenuItem';
import type Core from './Core';

export default class ContextMenuItems {
  id = uuidv4();
  items: MenuItem[] = [];

  constructor(
    items?: (options: { core: Core }) => MenuItemOption[],
    context?: { core: Core; [key: string]: unknown }
  ) {
    if (items && context) {
      this.items = generateMenuItems(items(context));
    }
  }

  add(contextMenuItems: ContextMenuItems) {
    if (contextMenuItems instanceof ContextMenuItems) {
      this.items.push(...contextMenuItems.items);
    }
  }
}
