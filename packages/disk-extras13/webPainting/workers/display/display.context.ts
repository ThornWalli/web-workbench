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

const context: Context = {
  options: new DisplayOptions(),
  setOptions: (options: DisplayOptions) => (context.options = options),
  getDimensionImageData: (scaled?: boolean) => {
    const scale = scaled ? context.options.zoomLevel : 1;
    return ipoint(
      (context.lastImageData?.width || 0) * scale,
      (context.lastImageData?.height || 0) * scale
    );
  },
  getDimensionOffscreenCanvas: () =>
    ipoint(
      context.offscreenCanvas?.width || 0,
      context.offscreenCanvas?.height || 0
    ),

  precisionNumber(value: number) {
    return precisionNumber(value, context.options.precision);
  },

  setZoom,
  setPosition,

  draw: (imageData: ImageData | undefined = context.lastImageData) =>
    render(context, imageData),

  action: (
    message: DisplayOutgoingPostMessage<MainWorkerIncomingAction>,
    transfer?: Transferable[]
  ) => action(self, message, transfer)
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

  if (context.offscreenCanvas && context.lastImageData) {
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
