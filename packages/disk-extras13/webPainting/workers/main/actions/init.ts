import {
  WORKER_ACTION_TYPE,
  type MainContext
} from '@web-workbench/disk-extras13/webPainting/types/worker';
import type { InitActionToMainWorker } from '@web-workbench/disk-extras13/webPainting/types/worker.message.main';
import type { InitMessageToWorkerManager } from '@web-workbench/disk-extras13/webPainting/types/worker.message.workerManager';

export default function initMessage(
  context: MainContext,
  data: InitActionToMainWorker
): InitMessageToWorkerManager {
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
    type: WORKER_ACTION_TYPE.INIT
  };
}
