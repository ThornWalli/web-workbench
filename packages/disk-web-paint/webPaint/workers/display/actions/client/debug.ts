import type { Context } from '@web-workbench/disk-web-paint/webPaint/types/worker/display';
import type { ActionSuccess } from '@web-workbench/disk-web-paint/webPaint/types/worker';
import type { ActionCommandToDisplayWorker } from '@web-workbench/disk-web-paint/webPaint/types/worker.message.display';
import type {
  DisplayDebugPayload,
  DisplayDebugSuccessPayload
} from '@web-workbench/disk-web-paint/webPaint/types/worker.payload';

export default function debug(
  context: Context,
  data: ActionCommandToDisplayWorker<DisplayDebugPayload>
): Promise<ActionSuccess<DisplayDebugSuccessPayload>> {
  if (context.canvas) {
    context.canvas.height = 405;
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
