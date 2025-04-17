import { v4 as uuidv4 } from 'uuid';
import { IPoint, ipoint } from '@js-basics/vector';
import { reactive } from 'vue';
import { SYMBOL } from '../utils/symbols';
import type Item from './FileSystem/Item';
import { ITEM_META } from './FileSystem/Item';
import ItemContainer from './FileSystem/ItemContainer';

interface Layout {
  position: IPoint | { x: number; y: number };
  size: IPoint | { x: number; y: number };
}

enum TYPE {
  CONTAINER = 'container',
  LINK = 'link',
  DEFAULT = 'default'
}

export default class SymbolItem {
  fsItem?: Item;
  command: string;

  type?: TYPE;
  id = uuidv4();
  layout = reactive<Layout>({
    position: ipoint(0, 0),
    size: ipoint(0, 0)
  });

  ignoreRearrange = false;

  model = reactive({
    title: 'Item Title',
    symbol: SYMBOL.DEFAULT,
    used: false,
    visible: true,
    url: '',
    ignoreRearrange: false
  });

  constructor({
    fsItem,
    command,

    model,
    layout
  }: {
    fsItem: Item;
    command: string;
    model: object;
    layout: Layout;
  }) {
    this.command = command;
    this.model = Object.assign(this.model, model);
    this.layout = Object.assign(this.layout, layout);

    this.fsItem = fsItem;
    if (this.fsItem) {
      const item = this.fsItem;
      // this.layout.position = ipoint(item.meta.get(ITEM_META.POSITION) || ipoint(0, 0));
      // this.model.visible = Boolean(item.meta.get(ITEM_META.VISIBLE));
      // this.model.symbol = item.meta.get(ITEM_META.SYMBOL);
      // this.model.url = item.meta.get(ITEM_META.WEB_URL);

      this.type = getTypeFromFsItem(item);

      this.setProperties(item);

      this.fsItem.events.subscribe(({ name }) => {
        if (name !== 'addItem' && name !== 'removeItem') {
          this.setProperties(fsItem);
        }
      });
    }
  }

  setLayout(layout: Layout) {
    if (layout.position) {
      this.layout.position = ipoint(layout.position.x, layout.position.y);
    }
    if (layout.size) {
      this.layout.size = ipoint(layout.size.x, layout.size.y);
    }
  }

  // eslint-disable-next-line complexity
  setProperties(fsItem: Item) {
    this.model.title = fsItem.name;
    this.layout.position =
      (fsItem.meta.get(ITEM_META.POSITION) &&
        preparePoint(
          fsItem.meta.get(ITEM_META.POSITION) as { x: number; y: number }
        )) ||
      ipoint(0, 0);
    this.model.visible = Boolean(fsItem.meta.get(ITEM_META.VISIBLE));
    this.model.symbol = fsItem.meta.get(ITEM_META.SYMBOL) as SYMBOL;
    if (fsItem.meta.get(ITEM_META.WEB_URL)) {
      this.model.url = String(fsItem.meta.get(ITEM_META.WEB_URL));
    }
    this.model.ignoreRearrange = !!fsItem.meta.get(
      ITEM_META.IGNORE_SYMBOL_REARRANGE
    );

    if (fsItem instanceof ItemContainer) {
      const command = [`openDirectory "${fsItem.getPath()}"`];
      if (fsItem.meta.get(ITEM_META.WINDOW_SYMBOL_REARRANGE) || false) {
        command.push('-sort-symbols');
      }
      const windowPosition =
        (fsItem.meta.get(ITEM_META.WINDOW_POSITION) &&
          preparePoint(
            fsItem.meta.get(ITEM_META.WINDOW_POSITION) as {
              x: number;
              y: number;
            }
          )) ||
        ipoint(0, 0);

      if (windowPosition.length > 0) {
        command.push(
          `--window-position="${ipoint(windowPosition.x, windowPosition.y).toArray().join(',')}"`
        );
      }
      const windowSize =
        (fsItem.meta.get(ITEM_META.WINDOW_SIZE) &&
          preparePoint(
            fsItem.meta.get(ITEM_META.WINDOW_SIZE) as { x: number; y: number }
          )) ||
        ipoint(0, 0);

      if (windowSize.length > 0) {
        command.push(
          `--window-size="${ipoint(windowSize.x, windowSize.y).toArray().join(',')}"`
        );
      }
      if (fsItem.meta.has(ITEM_META.WINDOW_SCALE)) {
        command.push(
          `--window-scale=${fsItem.meta.get(ITEM_META.WINDOW_SCALE)}`
        );
      }
      if (fsItem.meta.has(ITEM_META.WINDOW_SCROLL_X)) {
        command.push(
          `--window-scroll-x=${fsItem.meta.get(ITEM_META.WINDOW_SCROLL_X)}`
        );
      }
      if (fsItem.meta.has(ITEM_META.WINDOW_SCROLL_Y)) {
        command.push(
          `--window-scroll-y=${fsItem.meta.get(ITEM_META.WINDOW_SCROLL_Y)}`
        );
      }
      if (fsItem.meta.has(ITEM_META.WINDOW_SIDEBAR)) {
        command.push(
          `--window-sidebar=${fsItem.meta.get(ITEM_META.WINDOW_SIDEBAR)}`
        );
      }
      if (fsItem.meta.has(ITEM_META.WINDOW_FULL_SIZE)) {
        command.push(
          `--window-full-size=${fsItem.meta.get(ITEM_META.WINDOW_FULL_SIZE)}`
        );
      }

      this.command = command.join(' ');
    } else if (!this.model.url) {
      this.command = `execute "${fsItem.getPath()}"`;
    }
    //  else if ('type' in fsItem.data) {
    //   const command = [
    //       `openPreview "${fsItem.getPath()}"`
    //   ];

    //   if (fsItem.data.openMaximized) {
    //     command.push('-maximized');
    //   }

    //   this.command = command.join(' ');
    // }
  }
}

export function generateSymbolItems(items: SymbolItem[]) {
  return items.map(item =>
    item instanceof SymbolItem ? item : new SymbolItem(item)
  );
}

function getTypeFromFsItem(fsItem: Item) {
  if (fsItem instanceof ItemContainer) {
    return TYPE.CONTAINER;
  } else if (fsItem.meta.get(ITEM_META.WEB_URL)) {
    return TYPE.LINK;
  }
  return TYPE.DEFAULT;
}

const preparePoint = (vector: IPoint | { x: number; y: number }) => {
  if (vector instanceof IPoint) {
    return vector;
  }
  return ipoint(vector.x, vector.y);
};
