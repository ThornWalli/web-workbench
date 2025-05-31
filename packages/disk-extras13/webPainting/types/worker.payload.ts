import type { IPoint } from '@js-basics/vector';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BasePayload {}

export interface DrawRectanglePayload extends BasePayload {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface LoadImagePayload extends BasePayload {
  imageBitmap: ImageBitmap;
}

export interface ZoomPayload extends BasePayload {
  level: number;
  offset: IPoint & number;
}
