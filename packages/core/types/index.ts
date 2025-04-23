import type { IPoint } from '@js-basics/vector';

export interface Layout {
  position: IPoint & number;
  size: IPoint & number;
}
