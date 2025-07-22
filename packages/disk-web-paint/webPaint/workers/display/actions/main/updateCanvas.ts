import type { ActionCommandToDisplayWorker } from '@web-workbench/disk-web-paint/webPaint/types/worker.message.display';
import type { IContext } from '../../../../types/worker/display';
import type { ActionSuccess } from '../../../../types/worker';
import type {
  UpdateCanvasPayload,
  UpdateCanvasSuccessPayload
} from '../../../../types/worker.payload';

export default async function updateCanvas(
  context: IContext,
  data: ActionCommandToDisplayWorker<UpdateCanvasPayload>
): Promise<ActionSuccess<UpdateCanvasSuccessPayload>> {
  context.updateCanvas();
  return {
    type: data.type
  };
}
