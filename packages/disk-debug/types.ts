export enum CONFIG_NAME {
  SHOW_SYMBOL_USED = 'showSymbolUsed',
  SHOW_SELECTED = 'showSelected'
}

export interface Model {
  [CONFIG_NAME.SHOW_SYMBOL_USED]: boolean;
  [CONFIG_NAME.SHOW_SELECTED]: boolean;
}

export interface ModelSymbol {
  [CONFIG_NAME.SHOW_SYMBOL_USED]: boolean;
  [CONFIG_NAME.SHOW_SELECTED]: boolean;
}
