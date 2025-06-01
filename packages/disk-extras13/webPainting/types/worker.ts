import type { ClientIncomingAction } from './worker.message.client';
import type { DisplayWorkerIncomingAction } from './worker.message.display';
import type { MainWorkerIncomingAction } from './worker.message.main';
import type { BasePayload } from './worker.payload';

export enum WORKER_ACTION_TYPE {
  DEFAULT = 'default',
  REFRESH = 'refresh',
  DEBUG = 'debug',
  INIT = 'init',
  INIT_SUCCESS = 'initSuccess',
  REPLACE_CANVAS = 'replaceCanvas',
  ADD_RENDER_WORKER_PORT = 'addRenderWorkerPort',
  ADD_RENDER_WORKER_PORT_SUCCESS = 'addRenderWorkerPortSuccess',
  DRAW_RECTANGLE = 'drawRectangle',
  DRAW_RECTANGLE_SUCCESS = 'drawRectangleSuccess',
  LOAD_IMAGE = 'loadImage',
  LOAD_IMAGE_SUCCESS = 'loadImageSuccess',
  UPDATE_CANVAS = 'updateCanvas',
  SET_ZOOM = 'setZoom',
  SET_ZOOM_SUCCESS = 'setZoomSuccess',
  SET_POSITION = 'setPosition',
  SET_POSITION_SUCCESS = 'setPositionSuccess'
}

declare global {
  interface Window {
    test: CallableFunction[];
  }

  interface WorkerGlobal {
    postMessage<T>(message: T, transfer?: Transferable[]): void;
  }
  interface Worker {
    postMessage<T>(message: T, transfer?: Transferable[]): void;
  }
}

export interface MainIncomingPostMessage<Action = MainWorkerIncomingAction> {
  id: string; // Eindeutige ID für die Nachricht
  data: Action;
}

export interface DisplayOutgoingPostMessage<Action = MainWorkerIncomingAction> {
  id: string; // Eindeutige ID für die Nachricht
  data: Action;
}
export interface DisplayIncomingPostMessage<
  Action = DisplayWorkerIncomingAction
> {
  id: string; // Eindeutige ID für die Nachricht
  data: Action;
}

export interface IAction {
  type: WORKER_ACTION_TYPE;
}

export interface WorkerManagerIncomingPostMessage<
  Action = DisplayWorkerIncomingAction | ClientIncomingAction
> {
  id: string; // Eindeutige ID für die Nachricht
  data: Action;
}

export interface WorkerIncomingPostMessage<Data = DisplayWorkerIncomingAction> {
  id: string; // Eindeutige ID für die Nachricht
  data: Data;
}

export interface WorkerOutgoingPostMessage<Data = DisplayWorkerIncomingAction> {
  id: string; // Eindeutige ID für die Nachricht
  data: Data;
}

export interface ActionSuccess<
  Payload = BasePayload,
  Type = WORKER_ACTION_TYPE
> {
  type: Type;
  payload?: Payload;
}
