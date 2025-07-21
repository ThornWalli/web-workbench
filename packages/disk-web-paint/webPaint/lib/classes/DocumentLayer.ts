/* eslint-disable complexity */
import type { LayerDescription } from '../../types/layer';
import { BLEND_MODE } from '../../types/select';

export interface DocumentLayerConstructorOptions {
  id?: string;
  name?: string;
  imageBitmap: ImageBitmap;
  order?: number;
  opacity?: number;
  visible?: boolean;
  blendMode?: BLEND_MODE;
}

export class DocumentLayer implements LayerDescription {
  id: string;
  name: string;
  order: number;
  opacity: number;
  visible: boolean;
  blendMode: BLEND_MODE;
  imageBitmap: ImageBitmap;

  constructor(options: DocumentLayerConstructorOptions) {
    this.id = options?.id ?? crypto.randomUUID();
    this.name = options?.name ?? 'Untitled Layer';
    this.order = options?.order ?? 0;
    this.opacity = options?.opacity ?? 1;
    this.visible = options?.visible ?? true;
    this.blendMode = options?.blendMode ?? BLEND_MODE.NORMAL;
    this.imageBitmap = options.imageBitmap;
  }

  toJSON(): LayerDescription {
    return {
      id: this.id,
      name: this.name,
      order: this.order,
      opacity: this.opacity,
      visible: this.visible,
      blendMode: this.blendMode
    };
  }
}
