import { WORKER_ACTION_TYPE } from '../../../../../types/worker';
import type { ActionSuccess } from '../../../../../types/worker';
import type { IContext } from '../../../../../types/worker/main';
import type { ActionCommandToMainWorker } from '../../../../../types/worker.message.main';
import type {
  AddLayerPayload,
  AddLayerSuccessPayload
} from '../../../../../types/worker.payload';

export default async function addLayer(
  context: IContext,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  data: ActionCommandToMainWorker<AddLayerPayload>
): Promise<Promise<ActionSuccess<AddLayerSuccessPayload>>> {
  const layer = context.layerManager.addLayer();
  await context.layerManager.selectLayer(layer.id);

  await context.update({ client: true });

  return {
    type: WORKER_ACTION_TYPE.ADD_LAYER_SUCCESS
  };
}
