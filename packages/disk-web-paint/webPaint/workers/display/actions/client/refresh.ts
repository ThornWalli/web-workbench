import type { ActionCommandToDisplayWorker } from '@web-workbench/disk-web-paint/webPaint/types/worker.message.display';
import type { Context } from '../../../../types/display';
import type {
  RefreshPayload,
  RefreshSucessPayload
} from '@web-workbench/disk-web-paint/webPaint/types/worker.payload';
import { WORKER_ACTION_TYPE } from '@web-workbench/disk-web-paint/webPaint/types/worker';
import type { ActionSuccess } from '@web-workbench/disk-web-paint/webPaint/types/worker';

export default async function replaceCanvas(
  context: Context,
  data: ActionCommandToDisplayWorker<RefreshPayload>
): Promise<ActionSuccess<RefreshSucessPayload>> {
  const { dimension } = data.payload;

  if (context.canvas) {
    context.canvas.width = dimension.x;
    context.canvas.height = dimension.y;
    context.ctx!.imageSmoothingEnabled = false; // need by dimension change
    context.draw();
  }

  return {
    type: WORKER_ACTION_TYPE.REFRESH_SUCCESS
  };
}
