import type { IPoint } from '@js-basics/vector';
import type Color from '@web-workbench/core/classes/Color';
import type { LayerDescription } from './layer';

export interface DocumentLayer extends LayerDescription {
  imageBitmap: ImageBitmap;
}

export type DocumentData = ImageBitmap;

export interface IDocumentMeta {
  colors: {
    background: Color;
  };
  dimension: IPoint & number;
}

export interface DocumentFileLayer extends LayerDescription {
  dataUri?: string;
}

export interface DocumentFile {
  name: string;
  meta: IDocumentMeta;
  layers: DocumentFileLayer[];
}
