import type {
  ActionSuccess,
  DisplayContext
} from '@web-workbench/disk-extras13/webPainting/types/worker';
import type { UpdateCanvasMessageToDisplayWorker } from '@web-workbench/disk-extras13/webPainting/types/worker.message.display';

export default function updateCanvasMessage(
  context: DisplayContext,
  data: UpdateCanvasMessageToDisplayWorker
): ActionSuccess {
  const { ctx, offscreenCanvas } = context;
  const { imageData } = data.payload;

  if (ctx && offscreenCanvas && imageData) {
    context.draw(imageData);
  } else {
    console.warn(
      '[Zoom Worker - via mainWorkerPort] Missing ctx, offscreenCanvas, or imageData for zoomUpdate. Debug info: ctx_valid=',
      !!ctx,
      'offscreenCanvas_valid=',
      !!offscreenCanvas,
      'imageData_valid=',
      !!imageData
    );
  }
  return {
    type: data.type
  };
}
