import type { WORKER_ACTION_TYPE } from './worker';
import type {
  BasePayload,
  DisplayDebugPayload,
  InitDisplayPayload,
  RefreshPayload,
  SetPositionPayload,
  SetZoomPayload,
  UpdateBufferPayload,
  UpdateCanvasPayload
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
  | ActionCommandToDisplayWorker<SetZoomPayload, WORKER_ACTION_TYPE.SET_ZOOM>
  | ActionCommandToDisplayWorker<
      SetPositionPayload,
      WORKER_ACTION_TYPE.SET_POSITION
    >;
