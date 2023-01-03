import { v4 as uuidv4 } from 'uuid';
import { ipoint } from '@js-basics/vector';
import { SYMBOL } from '../utils/symbols';
import { ITEM_META } from './FileSystem/Item';
import ItemContainer from './FileSystem/ItemContainer';

export default class SymbolItem {
  type = null;
  id = uuidv4();
  layout = {
    position: ipoint(0, 0),
    size: ipoint(0, 0)
  };

  ignoreRearrange = false;

  model = {
    title: 'Item Title',
    symbol: SYMBOL.DEFAULT,
    used: false,
    visible: true
  };

  constructor ({
    fsItem = null,

    command,

    model,
    layout

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

      this.fsItem.events.subscribe(({ name, value }) => {
        if (name !== 'addItem' && name !== 'removeItem') {
          this.setProperties(fsItem);
        }
      });
    }
  }

  // eslint-disable-next-line complexity
  setProperties (fsItem) {
    this.model.title = fsItem.name;
    this.layout.position = ipoint(fsItem.meta.get(ITEM_META.POSITION) || ipoint(0, 0));
    this.model.visible = Boolean(fsItem.meta.get(ITEM_META.VISIBLE));
    this.model.symbol = fsItem.meta.get(ITEM_META.SYMBOL);
    this.model.url = fsItem.meta.get(ITEM_META.WEB_URL);
    this.model.ignoreRearrange = fsItem.meta.get(ITEM_META.IGNORE_SYMBOL_REARRANGE);

    if (fsItem instanceof ItemContainer) {
      const command = [
        `openDirectory "${fsItem.getPath()}"`
      ];
      if (fsItem.meta.get(ITEM_META.WINDOW_SYMBOL_REARRANGE) || false) {
        command.push('-sort-symbols');
      }
      const windowPosition = ipoint(fsItem.meta.get(ITEM_META.WINDOW_POSITION) || ipoint(0, 0));
      if (windowPosition.length > 0) {
        command.push(`--window-position="${ipoint(windowPosition).toArray().join(',')}"`);
      }
      const windowSize = ipoint(fsItem.meta.get(ITEM_META.WINDOW_SIZE) || ipoint(0, 0));
      if (windowSize.length > 0) {
        command.push(`--window-size="${ipoint(windowSize).toArray().join(',')}"`);
      }
      if (fsItem.meta.has(ITEM_META.WINDOW_SCALE)) {
        command.push(`--window-scale=${fsItem.meta.get(ITEM_META.WINDOW_SCALE)}`);
      }
      if (fsItem.meta.has(ITEM_META.WINDOW_SCROLL_X)) {
        command.push(`--window-scroll-x=${fsItem.meta.get(ITEM_META.WINDOW_SCROLL_X)}`);
      }
      if (fsItem.meta.has(ITEM_META.WINDOW_SCROLL_Y)) {
        command.push(`--window-scroll-y=${fsItem.meta.get(ITEM_META.WINDOW_SCROLL_Y)}`);
      }
      if (fsItem.meta.has(ITEM_META.WINDOW_FULL_SIZE)) {
        command.push(`--window-full-size=${fsItem.meta.get(ITEM_META.WINDOW_FULL_SIZE)}`);
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

export function generateSymbolItems (items) {
  return items.map(item => item instanceof SymbolItem ? item : new SymbolItem(item));
}

function getTypeFromFsItem (fsItem) {
  if (fsItem instanceof ItemContainer) {
    return 'container';
  } else if (fsItem.meta.get(ITEM_META.WEB_URL)) {
    return 'link';
  } else {
    return 'default';
  }
}
