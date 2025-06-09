import type { ActionSuccess, WORKER_ACTION_TYPE } from './worker';
import type { SetZoomSuccessPayload, SyncStatePayload } from './worker.payload';

export type ClientIncomingAction =
  | ActionSuccess<SyncStatePayload>
  | ActionSuccess<SetZoomSuccessPayload, WORKER_ACTION_TYPE.SET_ZOOM_SUCCESS>
  | ActionSuccess;
