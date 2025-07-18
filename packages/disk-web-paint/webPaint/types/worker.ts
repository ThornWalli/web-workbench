import type { ClientIncomingAction } from './worker.message.client';
import type { DisplayWorkerIncomingAction } from './worker.message.display';
import type { MainWorkerIncomingAction } from './worker.message.main';
import type { BasePayload } from './worker.payload';

export enum WORKER_ACTION_TYPE {
  DEFAULT = 'default',
  REFRESH = 'refresh',
  REFRESH_SUCCESS = 'refreshSuccess',
  DEBUG = 'debug',
  INIT = 'init',
  INIT_SUCCESS = 'initSuccess',

  SYNC_STATE = 'syncState',
  SYNC_STATE_SUCCESS = 'syncStateSuccess',

  ADD_RENDER_WORKER_PORT = 'addRenderWorkerPort',
  ADD_RENDER_WORKER_PORT_SUCCESS = 'addRenderWorkerPortSuccess',

  LOAD_IMAGE = 'loadImage',
  LOAD_IMAGE_SUCCESS = 'loadImageSuccess',
  UPDATE_CANVAS = 'updateCanvas',
  UPDATE_BUFFER = 'updateBuffer',
  UPDATE_BUFFER_SUCCESS = 'updateBufferSuccess',

  STACK = 'stack',
  STACK_SUCCESS = 'stackSuccess',

  UNDO_STACK = 'undoStack',
  UNDO_STACK_SUCCESS = 'undoStackSuccess',
  REDO_STACK = 'redoStack',
  REDO_STACK_SUCCESS = 'redoStackSuccess',

  CLEAR = 'clear',
  CLEAR_SUCCESS = 'clearSuccess',

  SET_ZOOM = 'setZoom',
  SET_ZOOM_SUCCESS = 'setZoomSuccess',

  ZOOM_FIT = 'zoomFit',
  ZOOM_FIT_SUCCESS = 'zoomFitSuccess',

  SET_POSITION = 'setPosition',
  SET_POSITION_SUCCESS = 'setPositionSuccess',
  USE_TOOL = 'useTool',
  USE_TOOL_SUCCESS = 'useToolSuccess',
  SET_SELECT_OPTIONS = 'setSelectOptions',
  SET_SELECT_OPTIONS_SUCCESS = 'setSelectOptionsSuccess',

  GET_DATA = 'getData',
  GET_DATA_SUCCESS = 'getDataSuccess',

  RESIZE = 'resize',
  RESIZE_SUCCESS = 'resizeSuccess',
  RESIZE_CANVAS = 'resizeCanvas',
  RESIZE_CANVAS_SUCCESS = 'resizeCanvasSuccess',

  GET_COLORS = 'getColors',
  GET_COLORS_SUCCESS = 'getColorsSuccess',

  IMAGE_OPERATION = 'imageOperation',
  IMAGE_OPERATION_SUCCESS = 'imageOperationSuccess',

  COLOR_PICKER = 'colorPicker',
  COLOR_PICKER_SUCCESS = 'colorPickerSuccess',

  SET_OPTIONS = 'setOptions',
  SET_OPTIONS_SUCCESS = 'setOptionsSuccess',

  INSERT_IMAGE = 'insertImage',
  INSERT_IMAGE_SUCCESS = 'insertImageSuccess',

  ROTATE = 'rotate',
  ROTATE_SUCCESS = 'rotateSuccess',
  FLIP = 'flip',
  FLIP_SUCCESS = 'flipSuccess'
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
  transfer?: Transferable[];
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
export interface IActionResult {
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
