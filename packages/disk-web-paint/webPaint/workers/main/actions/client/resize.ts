import { WORKER_ACTION_TYPE } from '../../../../types/worker';
import type { ActionSuccess } from '../../../../types/worker';
import { RESIZE_TYPE } from '../../../../types/worker/main';
import type { Context } from '../../../../types/worker/main';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import type {
  ResizePayload,
  ResizeSuccessPayload
} from '../../../../types/worker.payload';
import { resize as wasmResize, ResizeType } from '@web-workbench/wasm';
import type { IPoint } from '@js-basics/vector';
import { toDimension } from '@web-workbench/disk-web-paint/webPaint/utils/wasm';

export default async function resize(
  context: Context,

  data: ActionCommandToMainWorker<ResizePayload>
): Promise<[ActionSuccess<ResizeSuccessPayload>, Transferable[]]> {
  const { payload } = data;
  const buffer = new SharedArrayBuffer(
    payload.dimension.x * payload.dimension.y * 4
  );
  const view = new Uint8Array(buffer);

  view.set(
    processResize(
      context.view!,
      context.getDimension(),
      payload.dimension,
      payload.type
    ),
    0
  );

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

const resizeAlgorithm = {
  [RESIZE_TYPE.NEAREST_NEIGHBOR]: (
    data: Uint8Array,
    sourceDimension: IPoint & number,
    targetDimension: IPoint & number
  ) =>
    wasmResize(
      data,
      toDimension(sourceDimension),
      toDimension(targetDimension),
      ResizeType.NearestNeighbor
    ),
  [RESIZE_TYPE.BILINEAR]: (
    data: Uint8Array,
    sourceDimension: IPoint & number,
    targetDimension: IPoint & number
  ) =>
    wasmResize(
      data,
      toDimension(sourceDimension),
      toDimension(targetDimension),
      ResizeType.Bilinear
    ),
  [RESIZE_TYPE.LANCZOS]: (
    data: Uint8Array,
    sourceDimension: IPoint & number,
    targetDimension: IPoint & number
  ) =>
    wasmResize(
      data,
      toDimension(sourceDimension),
      toDimension(targetDimension),
      ResizeType.Lanczos3
    ),
  [RESIZE_TYPE.BICUBIC]: (
    data: Uint8Array,
    sourceDimension: IPoint & number,
    targetDimension: IPoint & number
  ) =>
    wasmResize(
      data,
      toDimension(sourceDimension),
      toDimension(targetDimension),
      ResizeType.Bicubic
    )
};

export function processResize(
  data: Uint8Array | Uint8ClampedArray,
  dataDimension: IPoint & number,
  dimension: IPoint & number,
  type: RESIZE_TYPE
) {
  return resizeAlgorithm[type](new Uint8Array(data), dataDimension, dimension);
}
