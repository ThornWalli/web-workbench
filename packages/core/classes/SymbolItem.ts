import { v4 as uuidv4 } from 'uuid';
import { ipoint } from '@js-basics/vector';
import { reactive, type Raw } from 'vue';
import { SYMBOL } from '../utils/symbols';
import type Item from './FileSystem/Item';
import ItemContainer from './FileSystem/ItemContainer';
import { ITEM_META } from './FileSystem/types';
import type { Layout, SymbolLayout } from '../types';
import type Core from './Core';

enum TYPE {
  CONTAINER = 'container',
  LINK = 'link',
  DEFAULT = 'default'
}

type Command = string | (() => string | undefined);

export interface ISymbolItem {
  ready?: boolean;
  fsItem?: Raw<ItemContainer | Item | undefined>;
  layout?: Partial<Layout>;
  command?: Command;
  model?: SymbolItemModel;
}
export interface SymbolItemModel {
  title: string;
  symbol?: SYMBOL;
  used?: boolean;
  visible?: boolean;
  url?: string;
  ignoreRearrange?: boolean;
}

export default class SymbolItem implements ISymbolItem {
  ready = false;

  fsItem?: Raw<ItemContainer | Item | undefined>;
  command?: Command;
  type: TYPE;
  id = uuidv4();
  layout = reactive<SymbolLayout>({
    position: ipoint(0, 0),
    size: ipoint(0, 0)
  });

  ignoreRearrange = false;

  model = reactive<SymbolItemModel>({
    title: 'Item Title',
    symbol: SYMBOL.DEFAULT,
    used: false,
    visible: true,
    url: undefined,
    ignoreRearrange: false
  });

  constructor({
    fsItem,
    command,
    model,
    layout
  }: ISymbolItem & {
    fsItem?: Item | ItemContainer;
    command?: Command;
    model?: SymbolItemModel;
  }) {
    this.type = TYPE.DEFAULT;
    this.command = command;
    this.model = reactive({ ...this.model, ...(model || {}) });
    this.layout = reactive({ ...this.layout, ...(layout || {}) });

    this.fsItem = fsItem;
    // if (this.fsItem) {
    //   const item = this.fsItem;
    //   // this.layout.position = ipoint(item.meta.get(ITEM_META.POSITION) || ipoint(0, 0));
    //   // this.model.visible = Boolean(item.meta.get(ITEM_META.VISIBLE));
    //   // this.model.symbol = item.meta.get(ITEM_META.SYMBOL);
    //   // this.model.url = item.meta.get(ITEM_META.WEB_URL);

    //   this.type = getTypeFromFsItem(item);

    //   this.setProperties(item);

    //   this.fsItem.events.subscribe(({ name }) => {
    //     if (name !== 'addItem' && name !== 'removeItem' && fsItem) {
    //       this.setProperties(fsItem);
    //     }
    //   });
    // }
  }

  async setup({ core }: { core: Core }) {
    const fsItem = this.fsItem;
    if (!fsItem || this.ready) {
      return;
    }
    this.type = getTypeFromFsItem(fsItem);
    await applyFsItemProperties(this, core);
    fsItem.events.subscribe(async ({ name }) => {
      if (name !== 'addItem' && name !== 'removeItem' && fsItem) {
        await applyFsItemProperties(this, core);
      }
    });

    this.ready = true;
  }

  setLayout(layout: Partial<SymbolLayout>) {
    if (layout.position) {
      this.layout.position = ipoint(layout.position.x, layout.position.y);
    }
    if (layout.size) {
      this.layout.size = ipoint(layout.size.x, layout.size.y);
    }
  }
}

async function applyFsItemProperties(symbolItem: SymbolItem, core: Core) {
  const fsItem = symbolItem.fsItem;
  if (!fsItem) {
    return;
  }
  symbolItem.model.title = fsItem.name || '';
  symbolItem.layout.position =
    (fsItem.meta.get(ITEM_META.POSITION) &&
      preparePoint(
        fsItem.meta.get(ITEM_META.POSITION) as { x: number; y: number }
      )) ||
    ipoint(0, 0);
  symbolItem.model.visible = Boolean(fsItem.meta.get(ITEM_META.VISIBLE));
  symbolItem.model.symbol = fsItem.meta.get(ITEM_META.SYMBOL) as SYMBOL;
  if (fsItem.meta.get(ITEM_META.WEB_URL)) {
    symbolItem.model.url = String(fsItem.meta.get(ITEM_META.WEB_URL));
  }

  symbolItem.model.ignoreRearrange = !!fsItem.meta.get(
    ITEM_META.IGNORE_SYMBOL_REARRANGE
  );

  if (fsItem.meta.get(ITEM_META.REFERENCE)) {
    const referenceItem = await core.modules.files?.fileSystem.get(
      String(fsItem.meta.get(ITEM_META.REFERENCE))
    );
    if (!referenceItem) {
      throw new Error('Reference item not found');
    }
    if (referenceItem.meta.get(ITEM_META.WEB_URL)) {
      symbolItem.model.url = String(referenceItem.meta.get(ITEM_META.WEB_URL));
    }
    symbolItem.command = () => getCommand(referenceItem, symbolItem.model);
  } else {
    symbolItem.command = () => getCommand(fsItem, symbolItem.model);
  }
}

// eslint-disable-next-line complexity
function getCommand(fsItem: Item, model: SymbolItemModel) {
  debugger;
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
      command.push(`--window-scale=${fsItem.meta.get(ITEM_META.WINDOW_SCALE)}`);
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
    return command.join(' ');
  } else if (!model.url) {
    return `execute "${fsItem.getPath()}"`;
  }
}

export function generateSymbolItems(items: ISymbolItem[], core: Core) {
  return items.map(item => {
    const symbolItem =
      item instanceof SymbolItem ? item : new SymbolItem({ ...item });
    symbolItem.setup({ core });
    return symbolItem;
  });
}

function getTypeFromFsItem(fsItem: Item) {
  if (fsItem instanceof ItemContainer) {
    return TYPE.CONTAINER;
  } else if (fsItem.meta.get(ITEM_META.WEB_URL)) {
    return TYPE.LINK;
  }
  return TYPE.DEFAULT;
}

function preparePoint(vector: { x: number; y: number }) {
  return ipoint(vector.x, vector.y);
}

export function resolveCommand(command: Command) {
  if (typeof command === 'function') {
    return command();
  } else {
    return command;
  }
}
