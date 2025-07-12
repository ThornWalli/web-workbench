import type { IPoint } from '@js-basics/vector';
import type Color from './Color';
// import TEST_IMAGE from '../../assets/lenna.jpg?url';

type DocumentData = ImageBitmap;

export interface DocumentMeta {
  colors: {
    background: Color;
  };
  dimension: IPoint & number;
}
export class Document {
  name: string;

  meta: DocumentMeta;

  readonly data: DocumentData;

  constructor({
    name,
    meta,
    data
  }: {
    name: string;
    meta: DocumentMeta;
    data?: DocumentData;
  }) {
    this.name = name;
    this.meta = meta;
    this.data = data || createImageBitmap(meta.dimension.x, meta.dimension.y);
  }

  setDimension(dimension: IPoint & number) {
    this.meta.dimension = dimension;
  }

  destroy() {
    this.data.close();
  }
}

function createImageBitmap(width: number, height: number): ImageBitmap {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context from OffscreenCanvas');
  }
  ctx.fillStyle = 'white'; // Default background color
  ctx.fillRect(0, 0, width, height);
  return canvas.transferToImageBitmap();
}

// const TEST_IMAGE =
//   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADICAIAAADdvUsCAAACS0lEQVR4nOzTMQ0AIADAMELw7wkPBD3I2EGrYM/WPXsAnVkHwO9MCDETQsyEEDMhxEwIMRNCzIQQMyHETAgxE0LMhBAzIcRMCDETQsyEEDMhxEwIMRNCzIQQMyHETAgxE0LMhBAzIcRMCDETQsyEEDMhxEwIMRNCzIQQMyHETAgxE0LMhBAzIcRMCDETQsyEEDMhxEwIMRNCzIQQMyHETAgxE0LMhBAzIcRMCDETQsyEEDMhxEwIMRNCzIQQMyHETAgxE0LMhBAzIcRMCDETQsyEEDMhxEwIMRNCzIQQMyHETAgxE0LMhBAzIcRMCDETQsyEEDMhxEwIMRNCzIQQMyHETAgxE0LMhBAzIcRMCDETQsyEEDMhxEwIMRNCzIQQMyHETAgxE0LMhBAzIcRMCDETQsyEEDMhxEwIMRNCzIQQMyHETAgxE0LMhBAzIcRMCDETQsyEEDMhxEwIMRNCzIQQMyHETAgxE0LMhBAzIcRMCDETQsyEEDMhxEwIMRNCzIQQMyHETAgxE0LMhBAzIcRMCDETQsyEEDMhxEwIMRNCzIQQMyHETAgxE0LMhBAzIcRMCDETQsyEEDMhxEwIMRNCzIQQMyHETAgxE0LMhBAzIcRMCDETQsyEEDMhxEwIMRNCzIQQMyHETAgxE0LMhBAzIcRMCDETQsyEEDMhxEwIMRNCzIQQMyHETAgxE0LMhBAzIcRMCDETQsyEEDMhxEwIMRNCzIQQMyHETAgxE0LMhBAzIcRMCDETQsyEEDMhxEwIMRNC7AUAAP//crAD/gwdV1gAAAAASUVORK5CYII=';
