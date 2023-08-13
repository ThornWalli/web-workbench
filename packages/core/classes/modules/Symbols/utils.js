export const ORDER_TYPE = {
  NAME: 0,
  TYPE: 1,
  CREATED_DATE: 2,
  EDITED_DATE: 3
};
export const ORDER_DIRECTION = {
  ASCENDING: 0,
  DESCENDING: 1
};

export const CONFIG_NAMES = {
  SHOW_INVISIBLE_SYMBOLS: 'symbolWrapper_showInvisibleItems',
  ORDER_TYPE: 'symbolWrapper_iconsOrderType',
  ORDER_DIRECTION: 'symbolWrapper_iconsOrderDirection'
};

export const CONFIG_DEFAULTS = {
  [CONFIG_NAMES.SHOW_INVISIBLE_SYMBOLS]: false,
  [CONFIG_NAMES.ORDER_TYPE]: ORDER_TYPE.NAME,
  [CONFIG_NAMES.ORDER_DIRECTION]: ORDER_DIRECTION.ASCENDING
};
