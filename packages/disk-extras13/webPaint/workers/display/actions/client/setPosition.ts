import type { Context } from '@web-workbench/disk-extras13/webPaint/types/display';
import { WORKER_ACTION_TYPE } from '@web-workbench/disk-extras13/webPaint/types/worker';
import type { ActionCommandToDisplayWorker } from '@web-workbench/disk-extras13/webPaint/types/worker.message.display';
import type { SetPositionPayload } from '@web-workbench/disk-extras13/webPaint/types/worker.payload';

export default function setPosition(
  context: Context,
  data: ActionCommandToDisplayWorker<SetPositionPayload>
) {
  context.setPosition(data.payload.position);
  context.updateCanvas();
  return {
    type: WORKER_ACTION_TYPE.SET_POSITION_SUCCESS,
    payload: {}
  };
}
