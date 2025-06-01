import type { ActionSuccess, WORKER_ACTION_TYPE } from './worker';
import type { SetZoomSuccessPayload } from './worker.payload';

export type ClientIncomingAction =
  | ActionSuccess<SetZoomSuccessPayload, WORKER_ACTION_TYPE.SET_ZOOM_SUCCESS>
  | ActionSuccess;
