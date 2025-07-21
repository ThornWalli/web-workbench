import { WORKER_ACTION_TYPE } from '../../../../../types/worker';
import type { ActionSuccess } from '../../../../../types/worker';
import type { IContext } from '../../../../../types/worker/main';
import type { ActionCommandToMainWorker } from '../../../../../types/worker.message.main';
import type {
  DupilicateLayerSuccessPayload,
  DuplicateLayerPayload
} from '../../../../../types/worker.payload';

export default async function duplicateLayer(
  context: IContext,

  data: ActionCommandToMainWorker<DuplicateLayerPayload>
): Promise<Promise<ActionSuccess<DupilicateLayerSuccessPayload>>> {
  const layer = context.layerManager.layerMap.get(data.payload.id);
  if (!layer) {
    return undefined;
  }
  const newLayer = context.layerManager.addLayer({
    name: `${layer.name} (copy)`,
    buffer: layer.buffer.buffer,
    dimension: layer.dimension
  });
  context.layerManager.selectLayer(newLayer.id);

  await context.update({ client: true });

  return {
    type: WORKER_ACTION_TYPE.DUPLICATE_LAYER_SUCCESS
  };
}
