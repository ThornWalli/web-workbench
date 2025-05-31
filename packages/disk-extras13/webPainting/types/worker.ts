import type { DisplayWorkerIncomingAction } from './worker.message.display';
import type { MainWorkerIncomingAction } from './worker.message.main';
import type { ManagerWorkerIncomingAction } from './worker.message.workerManager';
import type { BasePayload } from './worker.payload';

export enum WORKER_ACTION_TYPE {
  REFRESH = 'refresh',
  DEBUG = 'debug',
  INIT = 'init',
  REPLACE_CANVAS = 'replaceCanvas',
  ADD_RENDER_WORKER_PORT = 'addRenderWorkerPort',
  DRAW_RECTANGLE = 'drawRectangle',
  LOAD_IMAGE = 'loadImage',
  UPDATE_CANVAS = 'updateCanvas',
  ZOOM = 'zoom'
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

export interface MainContext {
  offscreenCanvas?: OffscreenCanvas;
  ctx?: OffscreenCanvasRenderingContext2D | null;
  displayWorkerPorts: MessagePort[];

  action: (
    message: WorkerIncomingPostMessage<ManagerWorkerIncomingAction>,
    transfer?: Transferable[]
  ) => void;
  actionDisplay: (
    displayPort: MessagePort,
    message: WorkerIncomingPostMessage<DisplayWorkerIncomingAction>,
    transfer?: Transferable[]
  ) => void;
  updateDisplays: () => void;
}

export interface DisplayContext {
  lastImageData?: ImageData;
  draw: (imageData?: ImageData) => void;
  offscreenCanvas?: OffscreenCanvas;
  ctx?: OffscreenCanvasRenderingContext2D | null;
  mainWorkerPort?: MessagePort;
  action: (
    message: DisplayOutgoingPostMessage<MainWorkerIncomingAction>,
    transfer?: Transferable[]
  ) => void;
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
  Action = DisplayWorkerIncomingAction
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

export interface ActionSuccess<Payload = BasePayload> {
  type: WORKER_ACTION_TYPE;
  payload?: Payload;
}
