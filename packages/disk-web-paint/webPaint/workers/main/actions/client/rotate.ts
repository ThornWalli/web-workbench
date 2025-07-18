import { WORKER_ACTION_TYPE } from '../../../../types/worker';
import type { ActionSuccess } from '../../../../types/worker';
import { ROTATE_TYPE } from '../../../../types/worker/main';
import type { Context } from '../../../../types/worker/main';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import type {
  RotatePayload,
  RotateSuccessPayload
} from '../../../../types/worker.payload';
import { rotate as wasm_rotate } from '@web-workbench/wasm';
import { ipoint } from '@js-basics/vector';
import type { IPoint } from '@js-basics/vector';
import {
  toDimension,
  toRotateType
} from '@web-workbench/disk-web-paint/webPaint/utils/wasm';

export default async function rotate(
  context: Context,
  data: ActionCommandToMainWorker<RotatePayload>
): Promise<[ActionSuccess<RotateSuccessPayload>, Transferable[]]> {
  const { payload } = data;

  const originDimension = context.getDimension();
  let newDimension: IPoint & number = context.getDimension();

  switch (payload.type) {
    case ROTATE_TYPE.ROTATE_90_DEGRESS:
      newDimension = ipoint(originDimension.y, originDimension.x);
      break;
    case ROTATE_TYPE.ROTATE_270_DEGRESS:
      newDimension = ipoint(originDimension.y, originDimension.x);
      break;
  }

  const buffer = new SharedArrayBuffer(newDimension.x * newDimension.y * 4);
  const view = new Uint8Array(buffer);

  const resultView = wasm_rotate(
    context.view!,
    toDimension(originDimension),
    toRotateType(payload.type)
  );

  view.set(resultView);

  context.setSharedBuffer(buffer, newDimension);

  context.setupDisplays();

  return [
    {
      type: WORKER_ACTION_TYPE.ROTATE_SUCCESS,
      payload: {
        dimension: context.getDimension()
      }
    },
    []
  ];
}
