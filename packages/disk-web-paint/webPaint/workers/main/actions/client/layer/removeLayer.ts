import { WORKER_ACTION_TYPE } from '../../../../../types/worker';
import type { ActionSuccess } from '../../../../../types/worker';
import type { IContext } from '../../../../../types/worker/main';
import type { ActionCommandToMainWorker } from '../../../../../types/worker.message.main';
import type {
  RemoveLayerPayload,
  RemoveLayerSuccessPayload
} from '../../../../../types/worker.payload';

export default async function removeLayer(
  context: IContext,

  data: ActionCommandToMainWorker<RemoveLayerPayload>
): Promise<Promise<ActionSuccess<RemoveLayerSuccessPayload>>> {
  context.layerManager.removeLayer(data.payload.id);

  await context.update({ client: true, layers: true });

  return {
    type: WORKER_ACTION_TYPE.ADD_LAYER_SUCCESS
  };
}
