import { WORKER_ACTION_TYPE } from '../../../../../types/worker';
import type { ActionSuccess } from '../../../../../types/worker';
import type { IContext } from '../../../../../types/worker/main';
import type { ActionCommandToMainWorker } from '../../../../../types/worker.message.main';
import type {
  MergeLayersPayload,
  MergeLayersSuccessPayload
} from '../../../../../types/worker.payload';
import {
  toBlendMode,
  toDimension
} from '@web-workbench/disk-web-paint/webPaint/utils/wasm';
import {
  mergeLayers as rust_mergeLayers,
  WasmLayer as rust_WasmLayer
} from '@web-workbench/wasm/pkg/wasm';

export default async function duplicateLayer(
  context: IContext,

  data: ActionCommandToMainWorker<MergeLayersPayload>
): Promise<Promise<ActionSuccess<MergeLayersSuccessPayload>>> {
  await mergeLayers(context, data.payload.ids);

  await context.update({ client: true });

  return {
    type: WORKER_ACTION_TYPE.DUPLICATE_LAYER_SUCCESS
  };
}

function mergeLayers(context: IContext, ids: string[]) {
  const layersToMerge = ids
    .map(id => context.layerManager.layerMap.get(id))
    .filter(Boolean);
  if (layersToMerge.length < 2) {
    throw new Error('At least two layers are required to merge');
  }

  const mergedLayer = context.layerManager.addLayer({
    name: `Merged Layer (${ids.join(', ')})`,
    dimension: layersToMerge[0].dimension
  });

  rust_mergeLayers(
    mergedLayer.view,
    toDimension(mergedLayer.dimension),
    layersToMerge.map(
      layer =>
        new rust_WasmLayer(
          layer.view!,
          toBlendMode(layer.blendMode),
          layer.opacity
        )
    ),
    true
  );

  context.layerManager.selectLayer(mergedLayer.id);

  // remove original layers
  ids.forEach(id => context.layerManager.removeLayer(id));
}
