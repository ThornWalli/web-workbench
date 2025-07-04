import type { ActionCommandToDisplayWorker } from '@web-workbench/disk-web-paint/webPaint/types/worker.message.display';
import type { Context } from '../../../../types/display';
import {
  WORKER_ACTION_TYPE,
  type ActionSuccess
} from '../../../../types/worker';
import type {
  UpdateBufferPayload,
  UpdateBufferSuccessPayload
} from '@web-workbench/disk-web-paint/webPaint/types/worker.payload';

export default async function updateCanvasMessage(
  context: Context,
  data: ActionCommandToDisplayWorker<UpdateBufferPayload>
): Promise<ActionSuccess<UpdateBufferSuccessPayload>> {
  const { sharedBuffer } = data.payload;

  context.setSharedBuffer(sharedBuffer);
  context.updateCanvas();

  return {
    type: WORKER_ACTION_TYPE.UPDATE_BUFFER_SUCCESS
  };
}
