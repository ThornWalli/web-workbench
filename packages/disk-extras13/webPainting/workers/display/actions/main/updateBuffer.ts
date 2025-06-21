import type { ActionCommandToDisplayWorker } from '@web-workbench/disk-extras13/webPainting/types/worker.message.display';
import type { Context } from '../../../../types/display';
import {
  WORKER_ACTION_TYPE,
  type ActionSuccess
} from '../../../../types/worker';
import type {
  UpdateBufferPayload,
  UpdateBufferSuccessPayload
} from '@web-workbench/disk-extras13/webPainting/types/worker.payload';
import { ipoint } from '@js-basics/vector';

export default async function updateCanvasMessage(
  context: Context,
  data: ActionCommandToDisplayWorker<UpdateBufferPayload>
): Promise<ActionSuccess<UpdateBufferSuccessPayload>> {
  const { sharedBuffer } = data.payload;
  context.setSharedBuffer(sharedBuffer);
  // context.updateCanvas();

  const offscreenDimension = context.getDimensionOffscreenCanvas();
  const imageDimension = sharedBuffer.dimension;
  context.updateCanvas();

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

  return {
    type: WORKER_ACTION_TYPE.UPDATE_BUFFER_SUCCESS
  };
}
