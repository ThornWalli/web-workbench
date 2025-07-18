import { WORKER_ACTION_TYPE } from '../../../../types/worker';
import type { ActionSuccess } from '../../../../types/worker';
import type { Context } from '../../../../types/worker/main';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import type {
  FlipPayload,
  FlipSuccessPayload
} from '../../../../types/worker.payload';
import { flip as wasm_flip } from '@web-workbench/wasm';
import {
  toDimension,
  toFlipType
} from '@web-workbench/disk-web-paint/webPaint/utils/wasm';

export default async function flip(
  context: Context,
  data: ActionCommandToMainWorker<FlipPayload>
): Promise<[ActionSuccess<FlipSuccessPayload>, Transferable[]]> {
  const { payload } = data;

  const dimension = context.getDimension();

  const resultView = wasm_flip(
    context.view!,
    toDimension(dimension),
    toFlipType(payload.type)
  );

  context.view!.set(resultView);
  context.setupDisplays();

  return [
    {
      type: WORKER_ACTION_TYPE.FLIP_SUCCESS
    },
    []
  ];
}
