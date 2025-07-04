import { ipoint, type IPoint } from '@js-basics/vector';
import type { Context } from '@web-workbench/disk-web-paint/webPaint/types/display';
import {
  WORKER_ACTION_TYPE,
  type ActionSuccess
} from '@web-workbench/disk-web-paint/webPaint/types/worker';
import type { ZoomFitSuccessPayload } from '@web-workbench/disk-web-paint/webPaint/types/worker.payload';

export default async function zoomFit(
  context: Context
): Promise<ActionSuccess<ZoomFitSuccessPayload>> {
  fitToDisplay(context, context.getDimensionImageData());
  context.updateCanvas();
  return {
    type: WORKER_ACTION_TYPE.ZOOM_FIT_SUCCESS
  };
}

export function fitToDisplay(
  context: Context,
  imageDimension: IPoint & number
) {
  const offscreenDimension = context.getDimensionOffscreenCanvas();

  const zoomLevel = Math.min(
    offscreenDimension.x / imageDimension.x,
    offscreenDimension.y / imageDimension.y
  );
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
