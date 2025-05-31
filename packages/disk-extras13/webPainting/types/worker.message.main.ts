import type { WORKER_ACTION_TYPE } from './worker';
import type {
  BasePayload,
  DrawRectanglePayload,
  LoadImagePayload,
  ZoomPayload
} from './worker.payload';

export interface UpdateCanvasMessageToMainWorker {
  type: WORKER_ACTION_TYPE.UPDATE_CANVAS;
  payload: {
    imageData: ImageData;
  };
}

export interface DebugActionToMainWorker {
  type: WORKER_ACTION_TYPE.DEBUG;
}

export interface InitActionToMainWorker {
  type: WORKER_ACTION_TYPE.INIT;
  payload: {
    canvas: OffscreenCanvas;
  };
}
export interface InitSuccessMessageToMainWorker {
  type: WORKER_ACTION_TYPE.INIT;
}

export interface AddDisplayWorkerPortMessage {
  type: WORKER_ACTION_TYPE.ADD_RENDER_WORKER_PORT;
  payload: {
    port: MessagePort;
  };
}

export interface ReplaceCanvasActionToMainWorker {
  type: WORKER_ACTION_TYPE.REPLACE_CANVAS;
  payload: {
    canvas: OffscreenCanvas;
  };
}

export interface ReplaceCanvasSuccessActionToMainWorker {
  type: WORKER_ACTION_TYPE.REPLACE_CANVAS;
}

export interface ActionCommandToMainWorker<
  Payload extends BasePayload = BasePayload
> {
  type: WORKER_ACTION_TYPE; // Beispiel für einen spezifischen Zeichenbefehl
  payload: Payload;
}

export type MainWorkerIncomingAction =
  | DebugActionToMainWorker
  | InitActionToMainWorker
  | InitSuccessMessageToMainWorker
  | ReplaceCanvasActionToMainWorker
  | ReplaceCanvasSuccessActionToMainWorker
  | AddDisplayWorkerPortMessage
  | ActionCommandToMainWorker<DrawRectanglePayload>
  | ActionCommandToMainWorker<LoadImagePayload>
  | ActionCommandToMainWorker<ZoomPayload>
  | UpdateCanvasMessageToMainWorker;
