import { WORKER_ACTION_TYPE } from '../../../../../types/worker';
import type { ActionSuccess } from '../../../../../types/worker';
import type { IContext } from '../../../../../types/worker/main';
import type { ActionCommandToMainWorker } from '../../../../../types/worker.message.main';
import type {
  GetOverviewLayersPayload,
  GetOverviewLayersSuccessPayload
} from '../../../../../types/worker.payload';
import { resize, ResizeType } from '@web-workbench/wasm/pkg/wasm';
import { toDimension } from '@web-workbench/disk-web-paint/webPaint/utils/wasm';
import { ipoint } from '@js-basics/vector';

export default async function getOverviewLayers(
  context: IContext,

  data: ActionCommandToMainWorker<GetOverviewLayersPayload>
): Promise<
  Promise<[ActionSuccess<GetOverviewLayersSuccessPayload>, Transferable[]]>
> {
  const layers = context.layerManager.layers.map(layer => {
    const { dimension, buffer } = layer.bufferDescription;

    const newDimension = ipoint(
      data.payload.width,
      Math.round(data.payload.width * (dimension.y / dimension.x))
    );

    const newBuffer = resize(
      new Uint8Array(buffer),
      toDimension(dimension),
      toDimension(newDimension),
      ResizeType.NearestNeighbor
    );

    return {
      ...layer.toJSON(),
      current: context.layerManager.currentLayer.id === layer.id,
      bufferDescription: {
        buffer: newBuffer,
        dimension: newDimension
      }
    };
  });

  return [
    {
      type: WORKER_ACTION_TYPE.GET_OVERVIEW_LAYERS_SUCCESS,
      payload: {
        layers
      }
    },
    []
  ];
}
