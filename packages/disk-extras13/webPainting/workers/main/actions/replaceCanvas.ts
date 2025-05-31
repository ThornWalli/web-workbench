import {
  WORKER_ACTION_TYPE,
  type MainContext
} from '@web-workbench/disk-extras13/webPainting/types/worker';
import type {
  ReplaceCanvasActionToMainWorker,
  ReplaceCanvasSuccessActionToMainWorker
} from '@web-workbench/disk-extras13/webPainting/types/worker.message.main';

export default function replaceCanvas(
  context: MainContext,
  data: ReplaceCanvasActionToMainWorker
): ReplaceCanvasSuccessActionToMainWorker {
  const initPayload = data.payload;

  context.offscreenCanvas = initPayload.canvas;
  context.ctx = context.offscreenCanvas.getContext('2d', {
    willReadFrequently: true
  });

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
