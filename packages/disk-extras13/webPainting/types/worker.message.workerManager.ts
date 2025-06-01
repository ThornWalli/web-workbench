import type { ActionSuccess, WORKER_ACTION_TYPE } from './worker';
import type {
  InitPayload,
  ReplaceCanvasSuccessPayload
} from './worker.payload';

export interface InitMessageToWorkerManager {
  type: WORKER_ACTION_TYPE.INIT;
}

export interface ReplaceCanvasActionToMainWorker {
  type: WORKER_ACTION_TYPE.REPLACE_CANVAS;
}

export type ManagerWorkerIncomingAction =
  | ActionSuccess
  | ActionSuccess<InitPayload, WORKER_ACTION_TYPE.INIT_SUCCESS>
  | ActionSuccess<ReplaceCanvasSuccessPayload, WORKER_ACTION_TYPE.INIT_SUCCESS>;
