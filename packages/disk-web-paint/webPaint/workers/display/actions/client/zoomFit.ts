import { ipoint } from '@js-basics/vector';
import type { IPoint } from '@js-basics/vector';
import type { IContext } from '@web-workbench/disk-web-paint/webPaint/types/worker/display';
import { WORKER_ACTION_TYPE } from '@web-workbench/disk-web-paint/webPaint/types/worker';
import type { ActionSuccess } from '@web-workbench/disk-web-paint/webPaint/types/worker';
import type { ActionCommandToDisplayWorker } from '@web-workbench/disk-web-paint/webPaint/types/worker.message.display';
import type {
  ZoomFitPayload,
  ZoomFitSuccessPayload
} from '@web-workbench/disk-web-paint/webPaint/types/worker.payload';

export default async function zoomFit(
  context: IContext,
  data: ActionCommandToDisplayWorker<ZoomFitPayload>
): Promise<ActionSuccess<ZoomFitSuccessPayload>> {
  fitToDisplay(context, context.getDimensionImageData(), data.payload.value);
  context.updateCanvas();
  return {
    type: WORKER_ACTION_TYPE.ZOOM_FIT_SUCCESS
  };
}

export function fitToDisplay(
  context: IContext,
  imageDimension: IPoint & number,
  value: number = 1
) {
  if (value <= 0) {
    value = 1;
  }

  const offscreenDimension = context.getDimensionOffscreenCanvas();
  const offset = 0.1;
  let zoomLevel = Math.min(
    offscreenDimension.x / imageDimension.x,
    offscreenDimension.y / imageDimension.y
  );
  zoomLevel =
    zoomLevel -
    Math.min(
      offscreenDimension.x / imageDimension.x,
      offscreenDimension.y / imageDimension.y
    ) *
      offset;

  zoomLevel *= value;
  if (zoomLevel !== 1) {
    context.setZoom(ipoint(0, 0), zoomLevel, true);
    context.updateCanvas();
    context.action({
      id: crypto.randomUUID(),
      data: {
        type: WORKER_ACTION_TYPE.SET_ZOOM_SUCCESS,
        payload: {
          position: context.options.position,
          currentZoomLevel: context.currentZoomLevel
        }
      }
    });
  }
}
