import type {
  DisplayIncomingPostMessage,
  DisplayOutgoingPostMessage,
  DisplayContext
} from '../types/worker';
import type { DisplayWorkerIncomingAction } from '../types/worker.message.display';
import type { MainWorkerIncomingAction } from '../types/worker.message.main';
import actions from './display/actions';

const context: DisplayContext = {
  draw: (imageData: ImageData | undefined = context.lastImageData) => {
    if (context.offscreenCanvas && context.ctx && imageData) {
      context.lastImageData = imageData;
      context.ctx.putImageData(imageData, 0, 0);
    } else {
      console.warn(
        '[Display Worker] Missing ctx, offscreenCanvas, or lastImageData for draw. Debug info: ctx_valid=',
        !!context.ctx,
        'offscreenCanvas_valid=',
        !!context.offscreenCanvas,
        'lastImageData_valid=',
        !!context.lastImageData
      );
    }
  },
  action: (
    message: DisplayOutgoingPostMessage<MainWorkerIncomingAction>,
    transfer?: Transferable[]
  ) => action(self, message, transfer)
};

self.onmessage = (
  event: MessageEvent<DisplayIncomingPostMessage<DisplayWorkerIncomingAction>>
) => {
  const { data } = event.data;
  actions(context, data);
};
function action(
  messagePort: MessagePort | WorkerGlobal,
  message: DisplayOutgoingPostMessage<MainWorkerIncomingAction>,
  transfer?: Transferable[]
) {
  messagePort.postMessage(message, transfer || []);
}
