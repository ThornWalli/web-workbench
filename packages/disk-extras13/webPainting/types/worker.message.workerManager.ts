import type { ActionSuccess, WORKER_ACTION_TYPE } from './worker';
import type {
  InitPayload,
  ReplaceCanvasSuccessPayload,
  SyncStatePayload
} from './worker.payload';

export interface InitMessageToWorkerManager {
  type: WORKER_ACTION_TYPE.INIT;
}

export type ManagerWorkerIncomingAction =
  | ActionSuccess
  | ActionSuccess<InitPayload, WORKER_ACTION_TYPE.INIT_SUCCESS>
  | ActionSuccess<ReplaceCanvasSuccessPayload, WORKER_ACTION_TYPE.INIT_SUCCESS>
  | ActionSuccess<SyncStatePayload, WORKER_ACTION_TYPE.SYNC_STATE>;
