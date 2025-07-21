import type { ActionCommandToDisplayWorker } from '@web-workbench/disk-web-paint/webPaint/types/worker.message.display';
import type { IContext } from '../../../../types/worker/display';
import { WORKER_ACTION_TYPE } from '../../../../types/worker';
import type { ActionSuccess } from '../../../../types/worker';
import type {
  UpdateBufferPayload,
  UpdateBufferSuccessPayload
} from '@web-workbench/disk-web-paint/webPaint/types/worker.payload';

export default async function updateBuffer(
  context: IContext,
  data: ActionCommandToDisplayWorker<UpdateBufferPayload>
): Promise<ActionSuccess<UpdateBufferSuccessPayload>> {
  const { sharedBuffer } = data.payload;

  context.setSharedBuffer(sharedBuffer);
  context.updateCanvas();

  return {
    type: WORKER_ACTION_TYPE.UPDATE_BUFFER_SUCCESS
  };
}
