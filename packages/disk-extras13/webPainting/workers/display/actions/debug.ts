import type {
  ActionSuccess,
  DisplayContext
} from '@web-workbench/disk-extras13/webPainting/types/worker';
import type { DebugActionToDisplayWorker } from '@web-workbench/disk-extras13/webPainting/types/worker.message.display';

export default function debug(
  context: DisplayContext,
  data: DebugActionToDisplayWorker
): Promise<ActionSuccess> {
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
