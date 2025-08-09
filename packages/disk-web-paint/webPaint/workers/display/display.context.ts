import { ipoint } from '@js-basics/vector';
import type { IPoint } from '@js-basics/vector';
import DisplayOptions from '../../lib/classes/DisplayOptions';
import type { IContext } from '../../types/worker/display';
import { render } from './display.render';
import type { DisplayOutgoingPostMessage } from '../../types/worker';
import type { MainWorkerIncomingAction } from '../../types/worker.message.main';
import type { ClientIncomingAction } from '../../types/worker.message.client';
import { precisionNumber } from '../../utils/number';
import { lastValueFrom, of } from 'rxjs';
import { serializeWorkerPostMessage } from '../../operators';
import type { BufferDescription } from '../../types/worker/main';
import type { DisplayWorkerIncomingAction } from '../../types/worker.message.display';
import type {
  LayerDisplayDescription,
  LayerDisplayImportDescription
} from '../../types/layer';
import { getCanvasFromImageData } from './utils/render';
import type { Value } from '../../operators/serializer/replacer';

export class Context implements IContext {
  layersViews: Uint8ClampedArray<ArrayBufferLike>[];
  layersSharedBuffers: BufferDescription[];
  isReady() {
    return !!this.view;
  }
  debug = false;
  options = new DisplayOptions();
  currentZoomLevel: 1;
  lastImageData;
  canvas;
  ctx;
  mainWorkerPort;

  view;
  bufferDescription: BufferDescription;

  layers: LayerDisplayDescription[] = [];
  // #region setters

  setOptions(options: DisplayOptions) {
    return (this.options = options);
  }
  setSharedBuffer(bufferDescription: BufferDescription) {
    this.bufferDescription = bufferDescription;
    this.view = new Uint8ClampedArray(bufferDescription.buffer);
  }
  setLayers(importLayers: LayerDisplayImportDescription[]) {
    const layers = importLayers.map<LayerDisplayDescription>(layer => {
      const buffer = layer.buffer;
      delete layer.buffer;
      let canvas: OffscreenCanvas | undefined;
      if (!layer.current) {
        const view = new Uint8ClampedArray(this.view.length);
        view.set(new Uint8ClampedArray(buffer.buffer));
        canvas = getCanvasFromImageData(
          new ImageData(view, buffer.dimension.x, buffer.dimension.y)
        );
      }
      return {
        ...layer,
        canvas
      };
    });

    this.layers = layers;
  }

  setZoom(position: IPoint & number, zoomLevel: number, override = false) {
    let newZoomLevel;
    const lastZoomLevel = this.options.zoomLevel;

    if (override) {
      newZoomLevel = zoomLevel;
    } else if (zoomLevel === 0) {
      newZoomLevel = 1;
    } else {
      newZoomLevel = lastZoomLevel * zoomLevel;
    }

    this.currentZoomLevel = newZoomLevel;

    if (this.canvas && this.lastImageData) {
      const offscreenCanvasDimension = this.getDimensionOffscreenCanvas();
      const imageDataDimension = this.getDimensionImageData();

      const targetPosition = ipoint(
        () =>
          ((position / lastZoomLevel) * offscreenCanvasDimension) /
          imageDataDimension /
          2
      );

      this.options.zoomLevel = newZoomLevel;
      this.options.position = ipoint(() =>
        this.precisionNumber(this.options.position + targetPosition)
      );
    }
  }

  setPosition(position: IPoint & number) {
    this.options.position = ipoint(() => this.precisionNumber(position));
  }

  // #endregion

  // #region getters

  getDimensionImageData(scaled?: boolean) {
    const scale = scaled ? this.options.zoomLevel : 1;
    return ipoint(
      (this.lastImageData?.width || 0) * scale,
      (this.lastImageData?.height || 0) * scale
    );
  }

  getDimensionOffscreenCanvas() {
    return ipoint(this.canvas?.width || 0, this.canvas?.height || 0);
  }

  // #endregion

  // #region methods

  precisionNumber(value: number) {
    return precisionNumber(value, this.options.precision);
  }

  updateCanvas() {
    if (this.view) {
      const view = new Uint8ClampedArray(this.view.length);
      view.set(this.view);

      const imageData = new ImageData(
        view,
        this.bufferDescription!.dimension.x,
        this.bufferDescription!.dimension.y
      );
      render(this, imageData);
    } else {
      console.warn('View is not set.');
    }
  }

  // #endregion

  // #region actions

  action(
    message: DisplayOutgoingPostMessage<DisplayWorkerIncomingAction>,
    transfer?: Transferable[]
  ) {
    return this._action(self as WorkerGlobal, message, transfer);
  }

  async _action<
    T extends Value =
      | DisplayOutgoingPostMessage<MainWorkerIncomingAction>
      | DisplayOutgoingPostMessage<ClientIncomingAction>
  >(
    messagePort: MessagePort | WorkerGlobal,
    message: T,
    transfer?: Transferable[]
  ) {
    const data = await lastValueFrom(
      of<T>(message).pipe(serializeWorkerPostMessage())
    );
    messagePort.postMessage(data, transfer || []);
  }

  // #endregion

  draw(imageData: ImageData | undefined = this.lastImageData) {
    render(this, imageData);
  }
}

const context = new Context();
export default context;
