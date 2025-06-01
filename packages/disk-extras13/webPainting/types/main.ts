import type {
  WorkerIncomingPostMessage,
  WorkerOutgoingPostMessage
} from './worker';
import type { DisplayWorkerIncomingAction } from './worker.message.display';
import type { ManagerWorkerIncomingAction } from './worker.message.workerManager';

export interface Context {
  offscreenCanvas?: OffscreenCanvas;
  ctx?: OffscreenCanvasRenderingContext2D | null;
  displayWorkerPorts: MessagePort[];

  action: (
    message: WorkerOutgoingPostMessage<ManagerWorkerIncomingAction>,
    transfer?: Transferable[]
  ) => void;
  actionDisplay: (
    displayPort: MessagePort,
    message:
      | WorkerIncomingPostMessage<DisplayWorkerIncomingAction>
      | WorkerIncomingPostMessage<DisplayWorkerIncomingAction>,
    transfer?: Transferable[]
  ) => void;
  updateDisplays: () => void;
}
