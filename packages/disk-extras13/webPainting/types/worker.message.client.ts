import type { ActionSuccess, WORKER_ACTION_TYPE } from './worker';
import type {
  ColorPickerSuccessPayload,
  GetDataSuccessPayload,
  SetZoomSuccessPayload,
  SyncStatePayload
} from './worker.payload';

export type ClientIncomingAction =
  | ActionSuccess<GetDataSuccessPayload, WORKER_ACTION_TYPE.GET_DATA_SUCCESS>
  | ActionSuccess<SyncStatePayload>
  | ActionSuccess<SetZoomSuccessPayload, WORKER_ACTION_TYPE.SET_ZOOM_SUCCESS>
  | ActionSuccess<
      ColorPickerSuccessPayload,
      WORKER_ACTION_TYPE.COLOR_PICKER_SUCCESS
    >
  | ActionSuccess;
