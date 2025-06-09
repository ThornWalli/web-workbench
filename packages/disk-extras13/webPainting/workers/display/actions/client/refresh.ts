import type { ActionCommandToDisplayWorker } from '@web-workbench/disk-extras13/webPainting/types/worker.message.display';
import type { Context } from '../../../../types/display';
import type {
  RefreshPayload,
  RefreshSucessPayload
} from '@web-workbench/disk-extras13/webPainting/types/worker.payload';
import type { ActionSuccess } from '@web-workbench/disk-extras13/webPainting/types/worker';

export default async function replaceCanvas(
  context: Context,
  data: ActionCommandToDisplayWorker<RefreshPayload>
): Promise<ActionSuccess<RefreshSucessPayload>> {
  const { dimension, density } = data.payload;

  if (context.canvas) {
    context.canvas.width = dimension.x * density;
    context.canvas.height = dimension.y * density;
    context.ctx!.imageSmoothingEnabled = false; // need by dimension change
    context.draw();
  }

  return {
    type: data.type
  };
}
