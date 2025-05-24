import type { IPoint } from '@js-basics/vector';
import type { Layout } from '@web-workbench/core/types';

export interface SymbolWrapperLayout extends Layout {
  position: IPoint & number;
}
