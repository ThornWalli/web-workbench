import type {
  InitPayload,
  InitSuccessPayload
} from '@web-workbench/disk-extras13/webPainting/types/worker.payload';
import type { Context } from '../../../../types/main';
import {
  WORKER_ACTION_TYPE,
  type ActionSuccess
} from '../../../../types/worker';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';

export default function initMessage(
  context: Context,
  data: ActionCommandToMainWorker<InitPayload>
): ActionSuccess<InitSuccessPayload> {
  const initPayload = data.payload;

  context.offscreenCanvas = initPayload.canvas;
  context.ctx = context.offscreenCanvas.getContext('2d', {
    willReadFrequently: true
  });

  // if (context.ctx) {
  //   context.ctx.fillStyle = 'white';
  //   context.ctx.fillRect(
  //     0,
  //     0,
  //     context.offscreenCanvas.width,
  //     context.offscreenCanvas.height
  //   );
  // }
  return {
    type: WORKER_ACTION_TYPE.INIT_SUCCESS
  };
}
