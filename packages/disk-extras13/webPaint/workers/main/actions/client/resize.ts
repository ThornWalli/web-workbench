import {
  WORKER_ACTION_TYPE,
  type ActionSuccess
} from '../../../../types/worker';
import { RESIZE_TYPE, type Context } from '../../../../types/main';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import type {
  ResizePayload,
  ResizeSuccessPayload
} from '../../../../types/worker.payload';
import {
  resizeImageBicubic,
  resizeImageBilinear,
  resizeImageLanczos,
  resizeImageNearestNeighbor
} from '@web-workbench/disk-extras13/webPaint/lib/utils/paint/resize';

export default async function resize(
  context: Context,

  data: ActionCommandToMainWorker<ResizePayload>
): Promise<[ActionSuccess<ResizeSuccessPayload>, Transferable[]]> {
  const { payload } = data;
  const buffer = new SharedArrayBuffer(
    payload.dimension.x * payload.dimension.y * 4
  );
  const view = new Uint8ClampedArray(buffer);

  const resizeAlgorithm = {
    [RESIZE_TYPE.NEAREST_NEIGHBOR]: resizeImageNearestNeighbor,
    [RESIZE_TYPE.BILINEAR]: resizeImageBilinear,
    [RESIZE_TYPE.BICUBIC]: resizeImageBicubic,
    [RESIZE_TYPE.LANCZOS]: resizeImageLanczos
  };

  const { x, y } = context.getDimension();
  const newView = resizeAlgorithm[payload.type](
    context.view!,
    x,
    y,
    payload.dimension.x,
    payload.dimension.y
  );
  view.set(newView, 0);

  context.setSharedBuffer(buffer, payload.dimension);

  context.setupDisplays();

  return [
    {
      type: WORKER_ACTION_TYPE.RESIZE_CANVAS_SUCCESS,
      payload: {
        dimension: context.getDimension()
      }
    },
    []
  ];
}
