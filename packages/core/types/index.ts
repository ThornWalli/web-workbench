import type { IPoint } from '@js-basics/vector';
import type { Ref } from 'vue';

export interface Layout {
  size: IPoint & number;
}

export interface SymbolLayout extends Layout {
  position: IPoint & number;
}

export type InjectParentLayout<T extends Layout> = Ref<T>;
