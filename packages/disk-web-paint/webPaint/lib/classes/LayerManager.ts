import type { IPoint } from '@js-basics/vector';
import type {
  BufferDescription,
  ILayer,
  ILayerManager
} from '../../types/worker/main';
import Layer from './Layer';
import { mergeLayers, WasmLayer } from '@web-workbench/wasm/pkg/wasm';
import { toBlendMode, toDimension } from '../../utils/wasm';
import { BLEND_MODE } from '../../types/select';

export class MergedLayer extends Layer {}

export default class LayerManager implements ILayerManager {
  buffer: BufferDescription;
  view: Uint8Array<ArrayBufferLike>;
  layers: ILayer[] = [];
  layerMap: Map<string, ILayer> = new Map();

  private _currentLayerId?: string;

  getCurrentLayerId() {
    return this._currentLayerId;
  }
  setCurrentLayerId(layerId: string | undefined) {
    this._currentLayerId = layerId;

    // this.prepareBeforeAfterViews(layerId);
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

    this.layers.push(layer);

    this.layerMap.set(layer.id, layer);
    if (isFirstLayer) {
      this.setBuffer(layer.buffer.dimension);
    }

    this.setCurrentLayerId(layer.id);
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
    layers.forEach(layer => {
      this.layerMap.set(layer.id, layer);
      if (!this._currentLayerId) {
        this._currentLayerId = layer.id;
      }
    });
  }

  async update(ignoreLayers?: boolean) {
    if (ignoreLayers) {
      if (!this.currentLayer) {
        throw new Error('No current layer to update');
      }
      this.view.set(this.currentLayer.view);
    } else {
      const layers = this.layers.filter(layer => layer.visible);
      if (layers.length) {
        await mergeLayers(
          this.view,
          toDimension(this.buffer.dimension),
          layers.map(
            layer =>
              new WasmLayer(
                layer.view!,
                toBlendMode(BLEND_MODE.NORMAL),
                layer.opacity
              )
          ),
          true
        );
      } else {
        this.view.fill(0);
      }
    }
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

  // Wir das überhaubt ben benötigt?

  /**
   * @deprecated
   */
  private _beforeView?: Uint8Array;
  /**
   * @deprecated
   */
  private _afterView?: Uint8Array;

  /**
   * @deprecated
   */
  get beforeView() {
    return this._beforeView;
  }

  /**
   * @deprecated
   */
  get afterView() {
    return this._afterView;
  }

  /**
   * @deprecated
   */
  prepareBeforeAfterViews(layerId: string) {
    // before
    const currentLayer = this.layerMap.get(layerId);
    const beforeLayers = this.layers.slice(
      0,
      this.layers.findIndex(layer => layer.id === layerId)
    );

    let beforeView: Uint8Array | undefined;
    if (beforeLayers.length) {
      beforeView = new Uint8Array(
        Array(currentLayer.dimension.x * currentLayer.dimension.y * 4).fill(0)
      );
      mergeLayers(
        beforeView,
        toDimension(currentLayer.dimension),
        beforeLayers.map(
          layer =>
            new WasmLayer(
              layer.view!,
              toBlendMode(BLEND_MODE.NORMAL),
              layer.opacity
            )
        ),
        true
      );
      this._beforeView = beforeView;
    } else {
      this._beforeView = undefined;
    }

    // after
    const afterLayers = this.layers.slice(
      this.layers.findIndex(layer => layer.id === layerId) + 1
    );
    let afterView: Uint8Array | undefined;
    if (afterLayers.length) {
      afterView = new Uint8Array(
        Array(currentLayer.dimension.x * currentLayer.dimension.y * 4).fill(0)
      );
      mergeLayers(
        afterView,
        toDimension(currentLayer.dimension),
        afterLayers.map(
          layer =>
            new WasmLayer(
              layer.view!,
              toBlendMode(BLEND_MODE.NORMAL),
              layer.opacity
            )
        ),
        true
      );
      this._afterView = afterView;
    } else {
      this._afterView = undefined;
    }
  }
}
