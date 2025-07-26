import type { IPoint } from '@js-basics/vector';
import type { IDocumentMeta } from '../../types/document';
import {
  DocumentLayer,
  type DocumentLayerConstructorOptions
} from './DocumentLayer';
import DocumentMeta from './DocumentMeta';
import { createBlankImageBitmap } from '../../utils/imageBitmap';

export class Document {
  name: string;

  meta: DocumentMeta;

  readonly layers: DocumentLayer[] = [];

  constructor({
    name,
    meta,
    layers
  }: {
    name: string;
    meta: IDocumentMeta;
    layers?: DocumentLayer[] | DocumentLayerConstructorOptions[];
  }) {
    this.name = name;
    this.meta = new DocumentMeta(meta);
    this.layers = layers
      ? layers.map(layer => new DocumentLayer(layer))
      : [
          new DocumentLayer({
            imageBitmap: createBlankImageBitmap(
              this.meta.dimension.x,
              this.meta.dimension.y,
              this.meta.colors.background.toHex()
            )
          })
        ];
  }

  setDimension(dimension: IPoint & number) {
    this.meta.dimension = dimension;
  }

  destroy() {
    this.layers.forEach(layer => {
      layer.imageBitmap.close();
    });
  }

  toJSON() {
    return {
      name: this.name,
      meta: this.meta.toJSON(),
      layers: this.layers.map(layer => layer.toJSON())
    };
  }
}
