import type { IPoint } from '@js-basics/vector';
import type {
  BufferDescription,
  ILayer,
  ILayerManager
} from '../../types/worker/main';
import Layer from './Layer';
import { mergeLayers, WasmLayer } from '@web-workbench/wasm/pkg/wasm';
import { toBlendMode, toDimension } from '../../utils/wasm';

export class MergedLayer extends Layer {}

export default class LayerManager implements ILayerManager {
  buffer: BufferDescription;
  view: Uint8Array<ArrayBufferLike>;
  layers: Layer[] = [];
  layerMap: Map<string, ILayer> = new Map();

  private _currentLayerId?: string;

  private onChange?: () => void;

  constructor(options?: { onChange?: LayerManager['onChange'] }) {
    this.onChange = options?.onChange;
  }

  getCurrentLayerId() {
    return this._currentLayerId;
  }
  setCurrentLayerId(layerId: string | undefined) {
    this._currentLayerId = layerId;
    this.onChange?.();
  }

  get currentLayer() {
    if (!this._currentLayerId) {
      return undefined;
    }
    return this.layerMap.get(this._currentLayerId);
  }

  addLayer(options?: {
    id?: string;
    name: string;
    buffer?: SharedArrayBuffer;
    dimension: IPoint & number;
  }) {
    const isFirstLayer = this.layers.length === 0;

    if (isFirstLayer && !options?.dimension) {
      throw new Error('First layer must have a dimension');
    }

    const defaultDimension =
      options?.dimension || this.layers[0]?.buffer.dimension;
    const layer = new Layer({
      ...options,
      dimension: options?.dimension ?? defaultDimension,
      order: this.layers.length
    });
    layer.layerManager = this;

    this.layers.push(layer);

    this.layerMap.set(layer.id, layer);
    if (isFirstLayer) {
      this.setBuffer(layer.buffer.dimension);
      this._currentLayerId = layer.id;
    }

    return layer;
  }

  removeLayer(_layerId: string): void {
    const layer = this.layerMap.get(_layerId);
    if (!layer) {
      return;
    }

    this.layers = this.layers.filter(l => l.id !== _layerId);
    this.layerMap.delete(_layerId);

    // reset current layer if it was removed
    if (this._currentLayerId === _layerId) {
      this._currentLayerId = this.layers.length ? this.layers[0].id : undefined;
    }

    // update order
    this.layers.forEach((l, index) => {
      l.order = index;
    });
  }

  selectLayer(layerId: string): void {
    this.setCurrentLayerId(layerId);
  }

  getLayerById(layerId: string): ILayer | undefined {
    return this.layerMap.get(layerId);
  }

  setLayers(layers: ILayer[]) {
    // reset current layers
    this.layers = layers;
    this.layerMap.clear();
    this._currentLayerId = undefined;

    if (!layers.length) {
      return;
    }

    this.setBuffer(layers[0].buffer.dimension);

    // set new layers
    this.layers.forEach(layer => {
      layer.layerManager = this;
      this.layerMap.set(layer.id, layer);
      if (!this._currentLayerId) {
        this._currentLayerId = layer.id;
      }
    });
  }

  async update() {
    if (!this.currentLayer) {
      throw new Error('No current layer to update');
    }
    this.view.set(this.currentLayer.view);
  }

  setBuffer(dimension: IPoint & number) {
    const sharedBuffer = new SharedArrayBuffer(dimension.x * dimension.y * 4);
    const view = new Uint8Array(sharedBuffer);

    this.view = view;
    this.buffer = {
      buffer: sharedBuffer,
      dimension: dimension
    };
  }

  getTotalView() {
    const currentLayer = this.currentLayer;
    if (!currentLayer) {
      throw new Error('No current layer to get total view');
    }
    const view = new Uint8Array(
      Array(currentLayer.dimension.x * currentLayer.dimension.y * 4).fill(0)
    );
    mergeLayers(
      view,
      toDimension(currentLayer.dimension),
      this.layers.map(layer => {
        return new WasmLayer(
          layer.view!,
          toBlendMode(layer.blendMode),
          layer.opacity
        );
      }),
      true
    );
    return view;
  }
}
