import type { IPoint } from '@js-basics/vector';

export type PlacementDescription = {
  position: IPoint & number;
  dimension: IPoint & number;
};
