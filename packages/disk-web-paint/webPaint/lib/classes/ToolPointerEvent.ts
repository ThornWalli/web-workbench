import type { IPoint } from '@js-basics/vector';
import type { ToolEvent } from './Tool';
import {
  dimensionToRealDimension,
  fixedDimension,
  fixedPosition,
  normalizeDimension,
  normalizePosition,
  positionToRealPosition,
  realPositionToPosition,
  unnormalizeDimension,
  unnormalizePosition
} from '../../utils/display';
import type DisplayOptions from './DisplayOptions';
import type { IDocumentMeta } from '../../types/document';

export default class ToolPointerEvent implements ToolEvent {
  documentMeta: IDocumentMeta;
  displayOptions: DisplayOptions;
  dimension: IPoint & number;
  ctx: CanvasRenderingContext2D;
  position: IPoint & number;
  seed: number;

  isIntersecting() {
    const realPosition = this.realPosition;
    return (
      realPosition.x >= 0 &&
      realPosition.y >= 0 &&
      realPosition.x < this.documentMeta.dimension.x &&
      realPosition.y < this.documentMeta.dimension.y
    );
  }

  constructor({
    dimension,
    position,
    ctx,
    documentMeta,
    displayOptions,
    seed
  }: {
    position: IPoint & number;
    dimension: IPoint & number;
    ctx: CanvasRenderingContext2D;
    documentMeta: IDocumentMeta;
    displayOptions: DisplayOptions;
    seed?: number;
  }) {
    this.dimension = dimension;
    this.position = position;
    this.ctx = ctx;
    this.documentMeta = documentMeta;
    this.displayOptions = displayOptions;
    this.seed = seed || getSeed(0, 1000000);
  }

  get normalizedPosition() {
    return normalizePosition(this.position, { dimension: this.dimension });
  }

  get realPosition() {
    return this.positionToRealPosition(this.normalizedPosition);
  }

  normalizePosition(position: IPoint & number) {
    return normalizePosition(position, { dimension: this.dimension });
  }
  unnormalizePosition(position: IPoint & number) {
    return unnormalizePosition(position, {
      dimension: this.dimension
    });
  }

  normalizeDimension(dimension: IPoint & number) {
    return normalizeDimension(dimension, { dimension: this.dimension });
  }
  unnormalizeDimension(dimension: IPoint & number) {
    return unnormalizeDimension(dimension, {
      dimension: this.dimension
    });
  }

  positionToRealPosition(position: IPoint & number) {
    return positionToRealPosition(position, {
      documentMeta: this.documentMeta,
      dimension: this.dimension,
      displayPosition: this.displayOptions.position,
      zoomLevel: this.displayOptions.zoomLevel
    });
  }
  realPositionToPosition(position: IPoint & number) {
    return realPositionToPosition(position, {
      documentMeta: this.documentMeta,
      dimension: this.dimension,
      displayPosition: this.displayOptions.position,
      zoomLevel: this.displayOptions.zoomLevel
    });
  }
  dimensionToRealDimension(dimension: IPoint & number) {
    return dimensionToRealDimension(dimension, {
      dimension: this.dimension,
      zoomLevel: this.displayOptions.zoomLevel
    });
  }
  fixedPosition(position: IPoint & number) {
    return fixedPosition(position, {
      documentMeta: this.documentMeta,
      dimension: this.dimension,
      displayOptions: this.displayOptions
    });
  }
  fixedDimension(dimension: IPoint & number) {
    return fixedDimension(dimension, {
      dimension: this.dimension,
      normalizedDimension: normalizeDimension(dimension, {
        dimension: this.dimension
      }),
      displayOptions: this.displayOptions
    });
  }
  fixedRealPosition(position: IPoint & number) {
    return fixedPosition(position, {
      documentMeta: this.documentMeta,
      displayOptions: this.displayOptions,
      dimension: this.dimension
    });
  }
}

function getSeed(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
