import type { IPoint } from '@js-basics/vector';
import type { BLEND_MODE } from './select';
import type { BufferDescription } from './worker/main';

export interface LayerDescription {
  order: number;
  id: string;
  name: string;
  opacity: number;
  visible: boolean;
  blendMode: BLEND_MODE;
}

export interface LayerExportDescription extends LayerDescription {
  dimension: IPoint & number;
  buffer: Uint8ClampedArray;
}

export interface LayerImportDescription extends LayerDescription {
  id: string;
  name: string;
  imageBitmap: ImageBitmap;
}

export interface LayerDisplayImportDescription extends LayerDescription {
  current: boolean;
  buffer: BufferDescription;
}
export interface LayerDisplayDescription extends LayerDescription {
  current: boolean;
  canvas: OffscreenCanvas;
}
