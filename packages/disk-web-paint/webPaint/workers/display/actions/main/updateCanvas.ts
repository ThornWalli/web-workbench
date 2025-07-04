import type { ActionCommandToDisplayWorker } from '@web-workbench/disk-web-paint/webPaint/types/worker.message.display';
import type { Context } from '../../../../types/display';
import type { ActionSuccess } from '../../../../types/worker';
import type {
  UpdateCanvasPayload,
  UpdateCanvasSuccessPayload
} from '../../../../types/worker.payload';

export default async function updateCanvas(
  context: Context,
  data: ActionCommandToDisplayWorker<UpdateCanvasPayload>
): Promise<ActionSuccess<UpdateCanvasSuccessPayload>> {
  context.updateCanvas();
  return {
    type: data.type
  };
}
