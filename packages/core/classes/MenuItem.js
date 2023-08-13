import { v4 as uuidv4 } from 'uuid';

export const MENU_ITEM_TYPE = {
  DEFAULT: 0,
  CHECKBOX: 1,
  RADIO: 2
};

export default class MenuItem {
  options = {
    disabled: false,
    checked: false
  };

  constructor({
    type = MENU_ITEM_TYPE.DEFAULT,

    model,
    options,

    action,
    command,
    url,

    order = -1,
    title = null,

    items = [],
    name = null,
    value = null,

    hotKey,
    keyCode,

    separator = false,

    onInit
  }) {
    this.id = uuidv4();
    this.type = type;

    this.model = model;
    this.options = Object.assign(
      options || {},
      this.options,
      Object.assign({}, options)
    );

    if (type === MENU_ITEM_TYPE.RADIO) {
      this.options.checked = this.options.checked = this.options.checked
        ? value
        : false;
    }

    this.action = action;
    this.command = command;
    this.url = url;

    this.name = name;
    this.value = value;

    this.order = order;
    this.title = title;
    this.items = generateMenuItems(items);
    this.hotKey = hotKey;
    this.keyCode = keyCode;
    this.separator = separator;

    if (onInit) {
      onInit(this);
    }
  }
}

export function generateMenuItems(items) {
  return items.map(item =>
    item instanceof MenuItem ? item : new MenuItem(item)
  );
}
