import { WORKER_ACTION_TYPE } from '../../../../../types/worker';
import type { ActionSuccess } from '../../../../../types/worker';
import type { IContext } from '../../../../../types/worker/main';
import type { ActionCommandToMainWorker } from '../../../../../types/worker.message.main';
import type {
  UpdateLayerPayload,
  UpdateLayerSuccessPayload
} from '../../../../../types/worker.payload';

export default async function updateLayer(
  context: IContext,
  data: ActionCommandToMainWorker<UpdateLayerPayload>
): Promise<Promise<ActionSuccess<UpdateLayerSuccessPayload>>> {
  const layerDescription = data.payload.data;

  const layer = context.layerManager.getLayerById(layerDescription.id);

  layer.blendMode = layerDescription.blendMode;
  layer.name = layerDescription.name;
  layer.opacity = layerDescription.opacity;
  layer.visible = layerDescription.visible;

  await context.update({ client: true, layers: true });

  return {
    type: WORKER_ACTION_TYPE.DUPLICATE_LAYER_SUCCESS
  };
}
