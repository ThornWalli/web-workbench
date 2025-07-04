import type { Context } from '@web-workbench/disk-web-paint/webPaint/types/display';
import {
  WORKER_ACTION_TYPE,
  type ActionSuccess
} from '@web-workbench/disk-web-paint/webPaint/types/worker';
import type { ActionCommandToDisplayWorker } from '@web-workbench/disk-web-paint/webPaint/types/worker.message.display';

import type {
  SetZoomPayload,
  SetZoomSuccessPayload
} from '@web-workbench/disk-web-paint/webPaint/types/worker.payload';

export default async function setZoom(
  context: Context,
  data: ActionCommandToDisplayWorker<SetZoomPayload>
): Promise<ActionSuccess<SetZoomSuccessPayload>> {
  context.setZoom(data.payload.position, data.payload.zoomLevel);
  context.updateCanvas();
  return {
    type: WORKER_ACTION_TYPE.SET_ZOOM_SUCCESS,
    payload: {
      position: context.options.position,
      currentZoomLevel: context.currentZoomLevel
    }
  };
}
