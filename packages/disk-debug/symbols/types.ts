export enum MODEL_OPTION {
  SHOW_SYMBOL_USED = 'showSymbolUsed',
  SHOW_SELECTED = 'showSelected'
}

export interface Model {
  showSymbolUsed: boolean;
  showSelected: boolean;
}
