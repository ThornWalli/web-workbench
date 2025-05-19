/* eslint-disable complexity */
import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import type { IPoint } from '@js-basics/vector';
import { ipoint, point } from '@js-basics/vector';
import { reactive, markRaw, ref } from 'vue';
import type SymbolItem from '../SymbolItem';
import { generateSymbolItems, type ISymbolItem } from '../SymbolItem';
import {
  CONFIG_NAMES,
  ORDER_DIRECTION,
  ORDER_TYPE
} from '../modules/Symbols/types';

import Event from '../Event';
import type Core from '../Core';
import type { SymbolWrapperLayout } from './types';

interface EventValue {
  wrapper: ASymbolWrapper;
  items?: SymbolItem[];
  item?: SymbolItem;
}
export class SymbolWrapperEvent extends Event<EventValue> {}

export class ISymbolWrapper {
  id = uuidv4();
  items = ref<SymbolItem[]>([]);
  selectedItems = ref<string[]>([]);

  core: Core;
  root = false;

  layout = reactive<SymbolWrapperLayout>({
    size: ipoint(0, 0),
    position: ipoint(0, 0)
  });

  size = ipoint(0, 0);
  parentSize = ipoint(0, 0);

  constructor(core: Core, items: ISymbolItem[] = [], root = false) {
    this.root = root || false;
    this.core = core;
    this.items.value = generateSymbolItems(items || [], this.core);
  }

  setLayout(layout: SymbolWrapperLayout) {
    if (layout.position) {
      this.layout.position = ipoint(layout.position.x, layout.position.y);
    }
    if (layout.size) {
      this.layout.size = ipoint(layout.size.x, layout.position.y);
    }
  }

  setSize(size: IPoint) {
    this.size = ipoint(size.x, size.y);
  }

  setParentSize(parentSize: IPoint) {
    this.parentSize = ipoint(parentSize.x, parentSize.y);
  }

  rearrangeIcons(
    options: {
      orderType?: ORDER_TYPE;
      orderDirection?: ORDER_DIRECTION;
      onlyVisible?: boolean;
      root?: boolean;
      margin?: number;
    } = {
      root: false,
      margin: 10
    }
  ) {
    options = Object.assign(
      {
        orderType:
          this.core.config.get(CONFIG_NAMES.ORDER_TYPE) || ORDER_TYPE.NAME,
        orderDirection:
          this.core.config.get(CONFIG_NAMES.ORDER_DIRECTION) ||
          ORDER_DIRECTION.ASCENDING,
        onlyVisible:
          !this.core.config.get(CONFIG_NAMES.SHOW_INVISIBLE_SYMBOLS) || false,
        root: false,
        margin: 10
      },
      options
    );
    let items = this.items.value;

    if (options.root) {
      options.orderType = ORDER_TYPE.NAME;
      options.orderDirection = ORDER_DIRECTION.DESCENDING;
    }

    if (options.onlyVisible) {
      items = items.filter(item => item.model.visible);
    }

    items = items.filter(item => !item.model.ignoreRearrange);

    switch (options.orderType) {
      case ORDER_TYPE.TYPE:
        items = items.sort((a, b) => {
          return a.type.localeCompare(b.type);
        });
        break;
      case ORDER_TYPE.CREATED_DATE:
        items = items.sort((a, b) => {
          const [aDate, bDate] = [
            a.fsItem?.createdDate || 0,
            b.fsItem?.createdDate || 0
          ];
          if (aDate === bDate) {
            return 0;
          } else if (aDate > bDate) {
            return 1;
          } else {
            return -1;
          }
        });
        break;
      case ORDER_TYPE.EDITED_DATE:
        items = items.sort((a, b) => {
          const [aDate, bDate] = [
            a.fsItem?.editedDate || 0,
            b.fsItem?.editedDate || 0
          ];
          if (aDate === bDate) {
            return 0;
          } else if (aDate > bDate) {
            return 1;
          } else {
            return -1;
          }
        });
        break;
      // case ORDER_TYPE.NAME:
      default:
        items = items.sort(a => {
          return a.model.title.localeCompare(a.model.title);
        });
    }
    switch (options.orderDirection) {
      case ORDER_DIRECTION.ASCENDING:
        items.reverse();
        break;
    }

    const itemMargin = options.margin || 0;
    let x: number;
    let y = itemMargin;

    const maxSize = point(0, 0);

    if (options.root) {
      x = this.size.x;
    } else {
      x = itemMargin;
    }

    items.forEach(item => {
      if (options.root) {
        item.layout.position = ipoint(x - item.layout.size.x, y);
        if (item.layout.size.x > maxSize.x) {
          maxSize.x = item.layout.size.x;
        }

        if (y + item.layout.size.y < this.parentSize.y) {
          y += item.layout.size.y + itemMargin;
        } else {
          x -= maxSize.x + itemMargin;
          y = itemMargin;
        }
      } else {
        if (item.layout.size.y > maxSize.y) {
          maxSize.y = item.layout.size.y;
        }
        item.layout.position = ipoint(x, y);
        if (x + item.layout.size.x < this.parentSize.x) {
          x += item.layout.size.x + itemMargin;
        } else {
          x = itemMargin;
          y += maxSize.y + itemMargin;
          item.layout.position = ipoint(x, y);
          x += item.layout.size.x + itemMargin;
        }
      }
    });

    return Promise.all(
      items.map(({ id, layout }) => this.savePosition(id, layout.position))
    );
  }

  clearSelectedItems() {
    [...this.selectedItems.value].forEach(id => this.unselectItem(id));
  }

  isSelectedItem(id: string) {
    return this.selectedItems.value.includes(id);
  }

  selectItem(id: string) {
    if (!this.isSelectedItem(id)) {
      this.selectedItems.value.push(id);
      return true;
    }
    return false;
  }

  unselectItem(id: string) {
    if (this.isSelectedItem(id)) {
      this.selectedItems.value = this.selectedItems.value.filter(v => v !== id);
      return true;
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async moveItem(id: string, wrapper: any): Promise<any> {
    console.warn('Method not implemented.', id, wrapper);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async moveItemToItem(from: any, to: any): Promise<any> {
    console.warn('Method not implemented.', to, from);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async savePosition(id: string, position: IPoint): Promise<any> {
    console.warn('Method not implemented.', id, position);
  }

  get(id: string) {
    return this.items.value.find(item => item.id === id);
  }

  has(id: string) {
    return !!this.items.value.find(item => item.id === id);
  }

  add(...symbolItems: SymbolItem[]) {
    const items = generateSymbolItems(symbolItems, this.core);
    this.items.value.push(...items);
    return items;
  }

  remove(id: string | SymbolItem) {
    let item: SymbolItem | undefined;
    if (typeof id === 'string') {
      item = this.get(id);
    } else {
      item = id;
    }
    if (item) {
      this.unselectItem(item.id);
      this.items.value.splice(this.items.value.indexOf(item), 1);
    }
    return item;
  }
}

export class ASymbolWrapper extends ISymbolWrapper {
  events = markRaw(new Subject<SymbolWrapperEvent>());

  override add(...symbolItems: SymbolItem[]) {
    const items = super.add(...symbolItems);
    this.events.next(
      new SymbolWrapperEvent({
        name: 'add',
        value: {
          wrapper: this,
          items: Array.from(items)
        }
      })
    );
    return items;
  }

  override remove(id: string | SymbolItem) {
    const item = super.remove(id);
    if (item) {
      this.events.next(
        new SymbolWrapperEvent({
          name: 'remove',
          value: {
            wrapper: this,
            item: item || undefined
          }
        })
      );
    }
    return item;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(...args: unknown[]) {
    return Promise.resolve();
  }

  override selectItem(id: string) {
    if (super.selectItem(id)) {
      this.events.next(
        new Event({
          name: 'selectItem',
          value: {
            wrapper: this,
            id
          }
        })
      );
      return true;
    }
    return false;
  }

  override unselectItem(id: string) {
    if (super.unselectItem(id)) {
      this.events.next(
        new Event({
          name: 'unselectItem',
          value: {
            wrapper: this,
            id
          }
        })
      );
      return true;
    }
    return false;
  }
}

export default class SymbolWrapper extends ASymbolWrapper {
  override async moveItem(id: string, wrapper: SymbolWrapper) {
    const item = this.get(id);
    if (item) {
      wrapper.add(item);
      this.remove(item);
      return true;
    }
    return false;
  }
}
