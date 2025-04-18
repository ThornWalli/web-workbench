import { v4 as uuidv4 } from 'uuid';

export enum MENU_ITEM_TYPE {
  DEFAULT = 0,
  SEPARATOR = 1,
  SPACER = 2,
  TEXT = 3,
  CHECKBOX = 4,
  RADIO = 5,
  UPLOAD = 6
}

export interface MenuItemOptions {
  order?: number;
  type?: MENU_ITEM_TYPE;
  model?: Record<string, unknown>;
  options?: Record<string, unknown>;
  action?: string | CallableFunction;
  command?: string;
  url?: string;
  title?: string;
  text?: string;
  name?: string;
  value?: unknown;
  hotKey?: string;
  keyCode?: number;
  items?: MenuItemOptions[];
  onInit?: (item: MenuItem) => void;
}

export default class MenuItem {
  id: string;
  type: MENU_ITEM_TYPE;
  model?: Record<string, unknown>;
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
  }: MenuItemOptions) {
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

export function generateMenuItems(items: (MenuItem | MenuItemOptions)[]) {
  return items.map(item =>
    item instanceof MenuItem ? item : new MenuItem(item)
  );
}
