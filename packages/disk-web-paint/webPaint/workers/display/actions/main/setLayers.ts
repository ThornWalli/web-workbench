import type { ActionCommandToDisplayWorker } from '@web-workbench/disk-web-paint/webPaint/types/worker.message.display';
import type { IContext } from '../../../../types/worker/display';
import { WORKER_ACTION_TYPE } from '../../../../types/worker';
import type { ActionSuccess } from '../../../../types/worker';
import type {
  SetLayerPayload,
  SetLayerSuccessPayload
} from '@web-workbench/disk-web-paint/webPaint/types/worker.payload';

export default async function setLayers(
  context: IContext,
  data: ActionCommandToDisplayWorker<SetLayerPayload>
): Promise<ActionSuccess<SetLayerSuccessPayload>> {
  const { layers } = data.payload;

  context.setLayers(layers);
  context.updateCanvas();

  return {
    type: WORKER_ACTION_TYPE.UPDATE_BUFFER_SUCCESS
  };
}
