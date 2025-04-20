import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function defineMenuItems(items: (options: any) => MenuItemOption[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (options: any) => items(options);
}

export enum MENU_ITEM_TYPE {
  DEFAULT = 0,
  SEPARATOR = 1,
  SPACER = 2,
  TEXT = 3,
  CHECKBOX = 4,
  RADIO = 5,
  UPLOAD = 6
}

export interface ItemModel {
  [key: string]: unknown;
}

export interface MenuItemOption {
  order?: number;
  type?: MENU_ITEM_TYPE;
  model?: ItemModel;
  options?: { [key: string]: unknown };
  action?: string | CallableFunction;
  command?: string;
  url?: string;
  title?: string;
  text?: string;
  name?: string;
  value?: unknown;
  hotKey?: string;
  keyCode?: number;
  items?: MenuItemOption[];
  onInit?: (item: MenuItem) => void;
}

export default class MenuItem implements MenuItemOption {
  id: string;
  type: MENU_ITEM_TYPE;
  model?: ItemModel;
  name?: string;
  value?: unknown;
  url?: string;
  action?: string | CallableFunction;
  command?: string;
  hotKey?: string;
  keyCode?: number;
  order?: number;
  title?: string;
  text?: string;

  items: MenuItem[];

  options = {
    disabled: false,
    checked: false
  };

  getValue() {
    if (this.model && this.name) {
      return this.model[this.name];
    } else {
      throw new Error('Model or name is not defined');
    }
  }

  setValue(value: unknown) {
    if (this.model && this.name) {
      this.model[this.name] = value;
    } else {
      throw new Error('Model or name is not defined');
    }
  }

  constructor({
    type = MENU_ITEM_TYPE.DEFAULT,

    model,
    options,

    action,
    command,
    url,

    order = -1,
    title,
    text,

    items = [],
    name,
    value,

    hotKey,
    keyCode,

    onInit
  }: MenuItemOption) {
    this.id = uuidv4();
    this.type = type;
    this.model = model || this.model;
    this.options = Object.assign(
      options || {},
      this.options,
      Object.assign({}, options)
    );

    if (type === MENU_ITEM_TYPE.RADIO) {
      this.options.checked = this.options.checked ? !!value : false;
    }

    this.action = action;
    this.command = command;
    this.url = url;

    this.name = name;
    this.value = value;

    this.order = order;
    this.title = title;
    this.text = text;
    this.items = generateMenuItems(items);
    this.hotKey = hotKey;
    this.keyCode = keyCode;

    if (onInit) {
      onInit(this);
    }
  }
}

export function generateMenuItems(items: (MenuItem | MenuItemOption)[]) {
  return items.map(item =>
    item instanceof MenuItem ? item : new MenuItem(item)
  );
}
