import type { ActionSuccess, DisplayContext } from '../../../types/worker';
import type { RefreshActionToDisplayWorker } from '../../../types/worker.message.display';

export default function replaceCanvas(
  context: DisplayContext,
  data: RefreshActionToDisplayWorker
): Promise<ActionSuccess> {
  const { dimension, density } = data.payload;

  if (context.offscreenCanvas) {
    context.offscreenCanvas.width = dimension.x * density;
    context.offscreenCanvas.height = dimension.y * density;
    context.draw();
  }

  return Promise.resolve({
    type: data.type
  });
}
