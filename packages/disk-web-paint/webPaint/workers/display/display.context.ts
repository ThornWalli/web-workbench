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
import type { SharedBuffer } from '../../types/worker/main';

class Context implements IContext {
  isReady() {
    return !!this.view;
  }
  debug = false;
  options = new DisplayOptions();
  currentZoomLevel: 1;
  lastImageData;
  canvas;
  ctx;
  view;
  sharedBuffer;
  mainWorkerPort;

  // #region setters

  setOptions(options: DisplayOptions) {
    return (this.options = options);
  }
  setSharedBuffer(sharedBuffer: SharedBuffer) {
    this.sharedBuffer = sharedBuffer;
    this.view = new Uint8ClampedArray(sharedBuffer.buffer);
  }
  setZoom = setZoom;
  setPosition = setPosition;

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
    if (!this.view) throw new Error('View is not set.');
    const view = new Uint8ClampedArray(this.view.length);
    view.set(this.view);
    const imageData = new ImageData(
      view,
      this.sharedBuffer!.dimension.x,
      this.sharedBuffer!.dimension.y
    );
    render(this, imageData);
  }

  // #endregion

  // #region actions

  action(
    message: DisplayOutgoingPostMessage<MainWorkerIncomingAction>,
    transfer?: Transferable[]
  ) {
    return action(self as WorkerGlobal, message, transfer);
  }

  // #endregion

  draw(imageData: ImageData | undefined = this.lastImageData) {
    render(this, imageData);
  }
}

const context = new Context();
export default context;

async function action<
  T =
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

function setPosition(position: IPoint & number) {
  this.options.position = ipoint(() => this.precisionNumber(position));
}

function setZoom(
  position: IPoint & number,
  zoomLevel: number,
  override = false
) {
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
