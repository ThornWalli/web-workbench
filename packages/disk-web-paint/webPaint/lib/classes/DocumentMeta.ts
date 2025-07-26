import { ipoint, type IPoint } from '@js-basics/vector';
import type { IDocumentMeta } from '../../types/document';
import Color from './Color';

export default class DocumentMeta implements IDocumentMeta {
  colors: {
    background: Color;
  };
  dimension: IPoint & number;

  constructor({
    colors,
    dimension
  }: {
    colors: { background: Color };
    dimension: IPoint & number;
  }) {
    this.colors = {
      background: new Color(255, 255, 255),
      ...colors
    };
    this.dimension = dimension
      ? ipoint(dimension.x, dimension.y)
      : ipoint(0, 0);
  }

  toJSON() {
    return {
      colors: {
        background: this.colors.background.toJSON()
      },
      dimension: this.dimension.toJSON()
    };
  }
}
