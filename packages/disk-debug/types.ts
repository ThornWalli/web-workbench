export enum CONFIG_NAMES {
  SHOW_SYMBOL_USED = 'showSymbolUsed',
  SHOW_SELECTED = 'showSelected'
}

export interface Model {
  [CONFIG_NAMES.SHOW_SYMBOL_USED]: boolean;
  [CONFIG_NAMES.SHOW_SELECTED]: boolean;
}

export interface ModelSymbol {
  [CONFIG_NAMES.SHOW_SYMBOL_USED]: boolean;
  [CONFIG_NAMES.SHOW_SELECTED]: boolean;
}
