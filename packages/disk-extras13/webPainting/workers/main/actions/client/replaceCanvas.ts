import type {
  ReplaceCanvasPayload,
  ReplaceCanvasSuccessPayload
} from '../../../../types/worker.payload';
import type { Context } from '../../../../types/main';
import {
  WORKER_ACTION_TYPE,
  type ActionSuccess
} from '../../../../types/worker';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';

export default function replaceCanvas(
  context: Context,
  data: ActionCommandToMainWorker<ReplaceCanvasPayload>
): ActionSuccess<ReplaceCanvasSuccessPayload> {
  const initPayload = data.payload;
  debugger;

  context.offscreenCanvas = initPayload.canvas;
  context.ctx = context.offscreenCanvas.getContext('2d', {
    willReadFrequently: true
  });
  context.ctx!.imageSmoothingEnabled = false;

  if (context.ctx) {
    context.ctx.fillStyle = 'white';
    context.ctx.fillRect(
      0,
      0,
      context.offscreenCanvas.width,
      context.offscreenCanvas.height
    );
  }
  return {
    type: WORKER_ACTION_TYPE.REPLACE_CANVAS
  };
}
