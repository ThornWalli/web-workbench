import { WORKER_ACTION_TYPE } from '../../../../../types/worker';
import type { ActionSuccess } from '../../../../../types/worker';
import type { IContext } from '../../../../../types/worker/main';
import type { ActionCommandToMainWorker } from '../../../../../types/worker.message.main';
import type {
  MoveLayersPayload,
  MoveLayersSuccessPayload
} from '../../../../../types/worker.payload';

export default async function moveLayers(
  context: IContext,

  data: ActionCommandToMainWorker<MoveLayersPayload>
): Promise<Promise<[ActionSuccess<MoveLayersSuccessPayload>, Transferable[]]>> {
  const orderedLayers = new Map(
    data.payload.layers.map(layer => [layer.id, layer])
  );

  context.layerManager.layers.forEach(layer => {
    const orderedLayer = orderedLayers.get(layer.id);
    if (orderedLayer) {
      layer.order = orderedLayer.order;
    }
  });

  context.layerManager.layers.sort((a, b) => a.order - b.order);

  await context.update({ client: true });

  return [
    {
      type: WORKER_ACTION_TYPE.MOVE_LAYER_SUCCESS
    },
    []
  ];
}
