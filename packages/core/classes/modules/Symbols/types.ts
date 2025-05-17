import type { FunctionalComponent } from 'vue';
import type Symbols from '.';
import type { ModuleConfig } from '../../Core/types';

export interface SymbolDescription {
  key: string;
  component: FunctionalComponent;
  group: string;
}

export enum ORDER_TYPE {
  NAME = 0,
  TYPE = 1,
  CREATED_DATE = 2,
  EDITED_DATE = 3
}
export enum ORDER_DIRECTION {
  ASCENDING = 0,
  DESCENDING = 1
}

export enum CONFIG_NAMES {
  SHOW_INVISIBLE_SYMBOLS = 'symbolWrapper_showInvisibleItems',
  ORDER_TYPE = 'symbolWrapper_iconsOrderType',
  ORDER_DIRECTION = 'symbolWrapper_iconsOrderDirection'
}

export interface SymbolsConfig extends ModuleConfig {
  [CONFIG_NAMES.SHOW_INVISIBLE_SYMBOLS]: boolean;
  [CONFIG_NAMES.ORDER_TYPE]: ORDER_TYPE;
  [CONFIG_NAMES.ORDER_DIRECTION]: ORDER_DIRECTION;
}

declare module '../../../classes/Config' {
  interface ConfigObservable {
    [CONFIG_NAMES.SHOW_INVISIBLE_SYMBOLS]: boolean;
    [CONFIG_NAMES.ORDER_TYPE]: ORDER_TYPE;
    [CONFIG_NAMES.ORDER_DIRECTION]: ORDER_DIRECTION;
  }
}

declare module '../../../classes/Core' {
  interface CoreModules {
    symbols: Symbols;
  }
}
