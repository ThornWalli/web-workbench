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
  bufferDescription: BufferDescription<Uint8Array | Uint8ClampedArray>;
}

export interface LayerImportDescription extends LayerDescription {
  id: string;
  name: string;
  imageBitmap: ImageBitmap;
}

export interface LayerOverviewDescription extends LayerDescription {
  current: boolean;
  bufferDescription: BufferDescription<Uint8Array | Uint8ClampedArray>;
}

export interface LayerDisplayImportDescription extends LayerDescription {
  current: boolean;
  buffer: BufferDescription;
}
export interface LayerDisplayDescription extends LayerDescription {
  current: boolean;
  canvas: OffscreenCanvas;
}
