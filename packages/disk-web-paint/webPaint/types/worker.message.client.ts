import type { ActionSuccess, WORKER_ACTION_TYPE } from './worker';
import type {
  ColorPickerSuccessPayload,
  GetColorsSuccessPayload,
  GetDataSuccessPayload,
  SetZoomSuccessPayload,
  SyncStatePayload,
  ZoomFitSuccessPayload
} from './worker.payload';

export type ClientIncomingAction =
  | ActionSuccess<GetDataSuccessPayload, WORKER_ACTION_TYPE.GET_DATA_SUCCESS>
  | ActionSuccess<SyncStatePayload>
  | ActionSuccess<SetZoomSuccessPayload, WORKER_ACTION_TYPE.SET_ZOOM_SUCCESS>
  | ActionSuccess<ZoomFitSuccessPayload, WORKER_ACTION_TYPE.ZOOM_FIT_SUCCESS>
  | ActionSuccess<
      ColorPickerSuccessPayload,
      WORKER_ACTION_TYPE.COLOR_PICKER_SUCCESS
    >
  | ActionSuccess<
      GetColorsSuccessPayload,
      WORKER_ACTION_TYPE.GET_COLORS_SUCCESS
    >
  | ActionSuccess;
