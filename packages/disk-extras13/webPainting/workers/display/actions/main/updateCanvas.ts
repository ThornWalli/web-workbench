import type { ActionCommandToDisplayWorker } from '@web-workbench/disk-extras13/webPainting/types/worker.message.display';
import type { Context } from '../../../../types/display';
import type { ActionSuccess } from '../../../../types/worker';
import type {
  UpdateCanvasPayload,
  UpdateCanvasSuccessPayload
} from '@web-workbench/disk-extras13/webPainting/types/worker.payload';

export default async function updateCanvasMessage(
  context: Context,
  data: ActionCommandToDisplayWorker<UpdateCanvasPayload>
): Promise<ActionSuccess<UpdateCanvasSuccessPayload>> {
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
