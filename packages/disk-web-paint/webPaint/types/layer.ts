import type { IPoint } from '@js-basics/vector';
import type { BLEND_MODE } from './select';

export interface LayerDescription {
  locked: boolean;
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

export interface LayerImportDescription {
  id: string;
  name: string;
  imageBitmap: ImageBitmap;
}
