import type { IPoint } from '@js-basics/vector';
import type { ILayer, BufferDescription } from '../../types/worker/main';
import { BLEND_MODE } from '../../types/select';
import type { LayerDescription } from '../../types/layer';

export default class Layer implements ILayer {
  order: number;
  locked: boolean;
  id: string = crypto.randomUUID();
  name: string;
  opacity: number;
  visible: boolean;
  blendMode: BLEND_MODE;
  buffer: BufferDescription;
  tmpBuffer: BufferDescription;
  view?: Uint8Array<ArrayBufferLike> | undefined;
  lastView?: Uint8Array<ArrayBufferLike> | undefined;
  tmpView?: Uint8Array<ArrayBufferLike> | undefined;

  constructor(options: {
    order?: number;
    locked?: boolean;
    id?: string;
    name?: string;
    opacity?: number;
    visible?: boolean;
    blendMode?: BLEND_MODE;
    buffer?: SharedArrayBuffer;
    dimension: IPoint & number;
  }) {
    this.order = options.order ?? 0;
    this.locked = options.locked ?? false;
    this.id = options.id ?? this.id;
    this.name = options.name ?? 'Layer';
    this.opacity = options.opacity ?? 1;
    this.visible = options.visible ?? true;
    this.blendMode = options.blendMode ?? BLEND_MODE.NORMAL;
    this.buffer = {
      buffer:
        options.buffer ||
        new SharedArrayBuffer(options.dimension.x * options.dimension.y * 4),
      dimension: options.dimension
    };
    this.tmpBuffer = { ...this.buffer };
    this.view = new Uint8Array(this.buffer.buffer);
    this.lastView = this.view.slice(0);
  }

  get dimension(): IPoint & number {
    return this.buffer.dimension;
  }

  setSharedBuffer(buffer: SharedArrayBuffer, dimension: IPoint & number) {
    this.buffer = { buffer, dimension };
    this.tmpBuffer = { buffer: buffer.slice(0), dimension };
    this.view = new Uint8Array(buffer);
    this.lastView = this.view.slice(0);
    this.tmpView = undefined;
  }

  setView(view: Uint8Array | Uint8ClampedArray) {
    if (view instanceof Uint8Array) {
      this.view?.set(view);
      this.tmpView?.set(view);
    }
  }

  createTmpView() {
    if (!this.tmpView) {
      if (this.buffer) {
        this.lastView = this.view?.slice(0);
        this.tmpView = new Uint8Array(this.buffer.buffer.slice(0));
      } else {
        throw new Error('Shared buffer is not set.');
      }
    }
    return this.tmpView;
  }

  updateTmpView() {
    if (this.view) {
      this.tmpView?.set(this.view);
    }
  }

  removeTmpView() {
    if (this.tmpView && this.view && this.lastView) {
      this.view?.set(this.lastView!);
    }
    this.tmpView = undefined;
  }

  toJSON(): LayerDescription {
    return {
      id: this.id,
      name: this.name,
      order: this.order,
      locked: this.locked,
      opacity: this.opacity,
      visible: this.visible,
      blendMode: this.blendMode
    };
  }
}
