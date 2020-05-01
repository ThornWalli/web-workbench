import { v4 as uuidv4 } from 'uuid';
import { generateMenuItems } from './MenuItem';

export default class ContextMenuItems {
  id = uuidv4();
  items = [];

  constructor (items, context) {
    if (items) {
      this.items = generateMenuItems(items(context));
    }
  }

  add (contextMenuItems) {
    if (contextMenuItems instanceof ContextMenuItems) {
      this.items.push(...contextMenuItems.items);
    }
  }
}
