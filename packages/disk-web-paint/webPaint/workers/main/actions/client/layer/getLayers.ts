import { WORKER_ACTION_TYPE } from '../../../../../types/worker';
import type { ActionSuccess } from '../../../../../types/worker';
import type { IContext } from '../../../../../types/worker/main';
import type { ActionCommandToMainWorker } from '../../../../../types/worker.message.main';
import type {
  GetLayersPayload,
  GetLayersSuccessPayload
} from '../../../../../types/worker.payload';

export default async function getLayers(
  context: IContext,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  data: ActionCommandToMainWorker<GetLayersPayload>
): Promise<Promise<[ActionSuccess<GetLayersSuccessPayload>, Transferable[]]>> {
  const layers = context.layerManager.layers.map(layer => {
    const { dimension, buffer } = layer.bufferDescription;

    return {
      ...layer.toJSON(),
      bufferDescription: {
        buffer: new Uint8ClampedArray(buffer),
        dimension: dimension
      }
    };
  });

  await context.update({ client: true });

  return [
    {
      type: WORKER_ACTION_TYPE.GET_LAYERS,
      payload: {
        layers
      }
    },
    []
  ];
}
