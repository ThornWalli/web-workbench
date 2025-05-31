import type { WORKER_ACTION_TYPE } from './worker';

export interface DebugActionToDisplayWorker {
  type: WORKER_ACTION_TYPE.DEBUG;
}

export interface InitMessageToDisplayWorker {
  type: WORKER_ACTION_TYPE.INIT;
  payload: {
    canvas: OffscreenCanvas;
  };
  port: MessagePort;
}

export interface UpdateCanvasMessageToDisplayWorker {
  type: WORKER_ACTION_TYPE.UPDATE_CANVAS;
  payload: {
    imageData: ImageData;
  };
}
export interface RefreshActionToDisplayWorker {
  type: WORKER_ACTION_TYPE.REFRESH;
  payload: {
    dimension: { x: number; y: number };
    density: number;
  };
}

export type DisplayWorkerIncomingAction =
  | DebugActionToDisplayWorker
  | InitMessageToDisplayWorker
  | UpdateCanvasMessageToDisplayWorker
  | RefreshActionToDisplayWorker;
