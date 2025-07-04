import { CONFIG_NAMES, ORDER_DIRECTION, ORDER_TYPE } from './types';
import type { SymbolsConfig } from './types';

export function getDefaultConfig(): SymbolsConfig {
  return {
    [CONFIG_NAMES.SHOW_INVISIBLE_SYMBOLS]: false,
    [CONFIG_NAMES.ORDER_TYPE]: ORDER_TYPE.NAME,
    [CONFIG_NAMES.ORDER_DIRECTION]: ORDER_DIRECTION.ASCENDING
  };
}
