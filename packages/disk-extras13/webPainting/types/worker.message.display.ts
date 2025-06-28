import type { WORKER_ACTION_TYPE } from './worker';
import type {
  BasePayload,
  ColorPickerPayload,
  DisplayDebugPayload,
  InitDisplayPayload,
  RefreshPayload,
  SetDisplayOptionsPayload,
  SetPositionPayload,
  SetZoomPayload,
  UpdateBufferPayload,
  UpdateCanvasPayload,
  ZoomFitPayload
} from './worker.payload';
export interface ActionCommandToDisplayWorker<
  Payload extends BasePayload = BasePayload,
  Type = WORKER_ACTION_TYPE
> {
  type: Type; // Beispiel für einen spezifischen Zeichenbefehl
  payload: Payload;
}

export type DisplayWorkerIncomingAction =
  | ActionCommandToDisplayWorker<InitDisplayPayload, WORKER_ACTION_TYPE.INIT>
  | ActionCommandToDisplayWorker<
      UpdateBufferPayload,
      WORKER_ACTION_TYPE.UPDATE_BUFFER
    >
  | ActionCommandToDisplayWorker<
      UpdateCanvasPayload,
      WORKER_ACTION_TYPE.UPDATE_CANVAS
    >
  | ActionCommandToDisplayWorker<DisplayDebugPayload, WORKER_ACTION_TYPE.DEBUG>
  | ActionCommandToDisplayWorker<RefreshPayload, WORKER_ACTION_TYPE.REFRESH>
  | ActionCommandToDisplayWorker<
      SetDisplayOptionsPayload,
      WORKER_ACTION_TYPE.SET_OPTIONS
    >
  | ActionCommandToDisplayWorker<SetZoomPayload, WORKER_ACTION_TYPE.SET_ZOOM>
  | ActionCommandToDisplayWorker<ZoomFitPayload, WORKER_ACTION_TYPE.ZOOM_FIT>
  | ActionCommandToDisplayWorker<
      SetPositionPayload,
      WORKER_ACTION_TYPE.SET_POSITION
    >
  | ActionCommandToDisplayWorker<
      ColorPickerPayload,
      WORKER_ACTION_TYPE.COLOR_PICKER
    >;
