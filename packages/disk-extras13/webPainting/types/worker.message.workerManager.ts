import type { WORKER_ACTION_TYPE } from './worker';

export interface InitMessageToWorkerManager {
  type: WORKER_ACTION_TYPE.INIT;
}

export interface ReplaceCanvasActionToMainWorker {
  type: WORKER_ACTION_TYPE.REPLACE_CANVAS;
}

export type ManagerWorkerIncomingAction =
  | InitMessageToWorkerManager
  | ReplaceCanvasActionToMainWorker;
