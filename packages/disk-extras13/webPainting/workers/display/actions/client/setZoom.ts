import { ipoint } from '@js-basics/vector';
import type { Context } from '@web-workbench/disk-extras13/webPainting/types/display';
import {
  WORKER_ACTION_TYPE,
  type ActionSuccess
} from '@web-workbench/disk-extras13/webPainting/types/worker';
import type { ActionCommandToDisplayWorker } from '@web-workbench/disk-extras13/webPainting/types/worker.message.display';

import type {
  SetZoomPayload,
  SetZoomSuccessPayload
} from '@web-workbench/disk-extras13/webPainting/types/worker.payload';

export default async function setZoom(
  context: Context,
  data: ActionCommandToDisplayWorker<SetZoomPayload>
): Promise<ActionSuccess<SetZoomSuccessPayload>> {
  context.setZoom(
    ipoint(data.payload.position.x, data.payload.position.y),
    data.payload.zoomLevel
  );
  context.draw();

  return {
    type: WORKER_ACTION_TYPE.SET_ZOOM_SUCCESS,
    payload: {
      position: context.options.position.toJSON(),
      zoomLevel: context.options.zoomLevel
    }
  };
}
