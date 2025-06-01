import type { Context } from '@web-workbench/disk-extras13/webPainting/types/display';
import type { ActionSuccess } from '@web-workbench/disk-extras13/webPainting/types/worker';
import type { ActionCommandToDisplayWorker } from '@web-workbench/disk-extras13/webPainting/types/worker.message.display';
import type {
  DisplayDebugPayload,
  DisplayDebugSuccessPayload
} from '@web-workbench/disk-extras13/webPainting/types/worker.payload';

export default function debug(
  context: Context,
  data: ActionCommandToDisplayWorker<DisplayDebugPayload>
): Promise<ActionSuccess<DisplayDebugSuccessPayload>> {
  if (context.offscreenCanvas) {
    context.offscreenCanvas.height = 405;
  }
  context.draw();
  console.log('DEBUG');

  // const { ctx, offscreenCanvas } = context;

  // if (ctx && offscreenCanvas && context.lastImageData) {
  //   ctx.putImageData(context.lastImageData, 0, 0);
  // }
  return Promise.resolve({
    type: data.type
  });
}
