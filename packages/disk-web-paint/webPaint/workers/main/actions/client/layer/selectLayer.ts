import { WORKER_ACTION_TYPE } from '../../../../../types/worker';
import type { ActionSuccess } from '../../../../../types/worker';
import type { IContext } from '../../../../../types/worker/main';
import type { ActionCommandToMainWorker } from '../../../../../types/worker.message.main';
import type {
  SelectLayerPayload,
  SelectLayerSuccessPayload
} from '../../../../../types/worker.payload';

export default async function selectLayer(
  context: IContext,
  data: ActionCommandToMainWorker<SelectLayerPayload>
): Promise<Promise<ActionSuccess<SelectLayerSuccessPayload>>> {
  await context.layerManager.selectLayer(data.payload.id);

  await context.update({ client: true, layers: true });

  return {
    type: WORKER_ACTION_TYPE.SELECT_CURRENT_SUCCESS
  };
}
