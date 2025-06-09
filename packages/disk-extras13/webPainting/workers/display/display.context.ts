import { ipoint, type IPoint } from '@js-basics/vector';
import { DisplayOptions } from '../../lib/classes/Display';
import type { Context } from '../../types/display';
import { render } from './display.render';
import type { DisplayOutgoingPostMessage } from '../../types/worker';
import type { MainWorkerIncomingAction } from '../../types/worker.message.main';
import type { ClientIncomingAction } from '../../types/worker.message.client';
import { precisionNumber } from '../../utils/number';
import { lastValueFrom, of } from 'rxjs';
import { serializeWorkerPostMessage } from '../../operators';
import type { SharedBuffer } from '../../types/main';

const context: Context = {
  debug: false,
  options: new DisplayOptions(),
  currentZoomLevel: 1,
  lastImageData: undefined,
  canvas: undefined,
  ctx: undefined,
  view: undefined,
  sharedBuffer: undefined,
  mainWorkerPort: undefined,

  // #region setters

  setOptions: (options: DisplayOptions) => (context.options = options),
  setSharedBuffer: (sharedBuffer: SharedBuffer) => {
    context.sharedBuffer = sharedBuffer;
    context.view = new Uint8ClampedArray(sharedBuffer.buffer);
  },
  setZoom,
  setPosition,

  // #endregion

  // #region getters

  getDimensionImageData: (scaled?: boolean) => {
    const scale = scaled ? context.options.zoomLevel : 1;
    return ipoint(
      (context.lastImageData?.width || 0) * scale,
      (context.lastImageData?.height || 0) * scale
    );
  },
  getDimensionOffscreenCanvas: () =>
    ipoint(context.canvas?.width || 0, context.canvas?.height || 0),

  // #endregion

  precisionNumber(value: number) {
    return precisionNumber(value, context.options.precision);
  },

  updateCanvas() {
    if (!context.view) throw new Error('View is not set.');
    const view = new Uint8ClampedArray(context.view.length);
    view.set(context.view);
    const imageData = new ImageData(
      view,
      context.sharedBuffer!.dimension.x,
      context.sharedBuffer!.dimension.y
    );
    render(context, imageData);
  },

  // #region actions

  action: (
    message: DisplayOutgoingPostMessage<MainWorkerIncomingAction>,
    transfer?: Transferable[]
  ) => action(self, message, transfer),

  // #endregion

  draw: (imageData: ImageData | undefined = context.lastImageData) =>
    render(context, imageData)
};

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
  context.options.position = ipoint(() => context.precisionNumber(position));
}

function setZoom(position: IPoint & number, zoomLevel: number) {
  let newZoomLevel;
  const lastZoomLevel = context.options.zoomLevel;

  if (zoomLevel === 0) {
    newZoomLevel = 1;
  } else {
    newZoomLevel = lastZoomLevel * zoomLevel;
  }

  context.currentZoomLevel = newZoomLevel;

  if (context.canvas && context.lastImageData) {
    const offscreenCanvasDimension = context.getDimensionOffscreenCanvas();
    const imageDataDimension = context.getDimensionImageData();

    const targetPosition = ipoint(
      () =>
        ((position / lastZoomLevel) * offscreenCanvasDimension) /
        imageDataDimension /
        2
    );

    context.options.zoomLevel = newZoomLevel;
    context.options.position = ipoint(() =>
      context.precisionNumber(context.options.position + targetPosition)
    );
  }
}
