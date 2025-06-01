import type { Context } from '../../types/main';
import {
  WORKER_ACTION_TYPE,
  type WorkerOutgoingPostMessage
} from '../../types/worker';
import type { DisplayWorkerIncomingAction } from '../../types/worker.message.display';
import type { ManagerWorkerIncomingAction } from '../../types/worker.message.workerManager';

const context: Context = {
  offscreenCanvas: undefined,
  ctx: null,
  displayWorkerPorts: [],

  // ########

  action: (
    message: WorkerOutgoingPostMessage<ManagerWorkerIncomingAction>,
    transfer?: Transferable[]
  ) => action(self, message, transfer),
  actionDisplay: () =>
    context.displayWorkerPorts.forEach(displayPort => {
      return (
        message: WorkerOutgoingPostMessage<DisplayWorkerIncomingAction>,
        transfer?: Transferable[]
      ) => action(displayPort, message, transfer);
    }),
  updateDisplays: () => {
    if (!context.offscreenCanvas || !context.ctx) {
      console.error('OffscreenCanvas or context is not initialized.');
      return;
    }
    const {
      ctx,
      offscreenCanvas,
      displayWorkerPorts: zoomWorkerPorts
    } = context;
    const imageData = ctx.getImageData(
      0,
      0,
      offscreenCanvas.width,
      offscreenCanvas.height
    );

    return sendUpdateMessage(zoomWorkerPorts, imageData);
  }

  // action: (
  //   message: WorkerIncomingPostMessage<ManagerWorkerIncomingAction>,
  //   transfer?: Transferable[]
  // ) => void;
  // actionDisplay: (
  //   displayPort: MessagePort,
  //   message: WorkerIncomingPostMessage<DisplayWorkerIncomingAction>,
  //   transfer?: Transferable[]
  // ) => void;
  // actionDisplayUpdate: () => void;
  // sendMessage,
  // sendUpdateMessage: () => {
  //   if (!context.offscreenCanvas || !context.ctx) {
  //     console.error('OffscreenCanvas or context is not initialized.');
  //     return;
  //   }
  //   const {
  //     ctx,
  //     offscreenCanvas,
  //     displayWorkerPorts: zoomWorkerPorts
  //   } = context;
  //   const imageData = ctx.getImageData(
  //     0,
  //     0,
  //     offscreenCanvas.width,
  //     offscreenCanvas.height
  //   );

  //   return sendUpdateMessage(zoomWorkerPorts, imageData);
  // }
};
export default context;

function action(
  messagePort: MessagePort | WorkerGlobal,
  message:
    | WorkerOutgoingPostMessage<ManagerWorkerIncomingAction>
    | WorkerOutgoingPostMessage<DisplayWorkerIncomingAction>,
  transfer?: Transferable[]
) {
  messagePort.postMessage(message, transfer || []);
}

function sendUpdateMessage(
  displayWorkerPorts: MessagePort[],
  imageData: ImageData
) {
  displayWorkerPorts.forEach(messagePort => {
    const imageDataBufferCopy = imageData.data.buffer.slice(0);
    action(
      messagePort,
      {
        id: crypto.randomUUID(),
        data: {
          type: WORKER_ACTION_TYPE.UPDATE_CANVAS,
          payload: {
            imageData: new ImageData(
              new Uint8ClampedArray(imageDataBufferCopy),
              imageData.width,
              imageData.height
            )
          }
        }
      },
      [imageDataBufferCopy]
    );
  });
}
