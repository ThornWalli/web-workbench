import type { ActionCommandToDisplayWorker } from '@web-workbench/disk-extras13/webPainting/types/worker.message.display';
import type { Context } from '../../../../types/display';
import type { ActionSuccess } from '../../../../types/worker';
import type {
  UpdateBufferPayload,
  UpdateBufferSuccessPayload
} from '@web-workbench/disk-extras13/webPainting/types/worker.payload';

export default async function updateCanvasMessage(
  context: Context,
  data: ActionCommandToDisplayWorker<UpdateBufferPayload>
): Promise<ActionSuccess<UpdateBufferSuccessPayload>> {
  const { sharedBuffer } = data.payload;
  context.setSharedBuffer(sharedBuffer);
  context.updateCanvas();
  return {
    type: data.type
  };
}
