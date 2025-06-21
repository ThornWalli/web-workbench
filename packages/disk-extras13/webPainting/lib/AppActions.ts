import type {
  GetColorsPayload,
  ResizeCanvasPayload,
  ResizePayload
} from './../types/worker.payload';
import { WORKER_ACTION_TYPE, type ActionSuccess } from '../types/worker';
import type { ActionCommandToMainWorker } from '../types/worker.message.main';
import {
  STACK_ACTION,
  type GetDataPayload,
  type GetDataSuccessPayload,
  type SetOptionsPayload,
  type StackPayload
} from '../types/worker.payload';
import type { App } from './App';

export default class AppActions {
  constructor(private app: App) {}
  stackUndo() {
    return this.app.workerManager.action<
      ActionCommandToMainWorker<StackPayload, WORKER_ACTION_TYPE.STACK>
    >({
      type: WORKER_ACTION_TYPE.STACK,
      payload: {
        action: STACK_ACTION.BACKWARD
      }
    });
  }
  stackRedo() {
    return this.app.workerManager.action<
      ActionCommandToMainWorker<StackPayload, WORKER_ACTION_TYPE.STACK>
    >({
      type: WORKER_ACTION_TYPE.STACK,
      payload: {
        action: STACK_ACTION.FORWARD
      }
    });
  }

  setSelectOptions(payload: SetOptionsPayload) {
    return this.app.workerManager.action<
      ActionCommandToMainWorker<
        SetOptionsPayload,
        WORKER_ACTION_TYPE.SET_SELECT_OPTIONS
      >
    >({
      type: WORKER_ACTION_TYPE.SET_SELECT_OPTIONS,
      payload
    });
  }

  getData(payload: GetDataPayload = {}) {
    return this.app.workerManager.action<
      ActionCommandToMainWorker<GetDataPayload, WORKER_ACTION_TYPE.GET_DATA>,
      ActionSuccess<GetDataSuccessPayload, WORKER_ACTION_TYPE.GET_DATA_SUCCESS>
    >({
      type: WORKER_ACTION_TYPE.GET_DATA,
      payload
    });
  }

  resize(payload: ResizePayload) {
    return this.app.workerManager.action<
      ActionCommandToMainWorker<ResizePayload, WORKER_ACTION_TYPE.RESIZE>
    >({
      type: WORKER_ACTION_TYPE.RESIZE,
      payload
    });
  }

  resizeCanvas(payload: ResizeCanvasPayload) {
    return this.app.workerManager.action<
      ActionCommandToMainWorker<
        ResizeCanvasPayload,
        WORKER_ACTION_TYPE.RESIZE_CANVAS
      >
    >({
      type: WORKER_ACTION_TYPE.RESIZE_CANVAS,
      payload
    });
  }

  getColors() {
    return this.app.workerManager.action<
      ActionCommandToMainWorker<GetColorsPayload, WORKER_ACTION_TYPE.GET_COLORS>
    >({
      type: WORKER_ACTION_TYPE.GET_COLORS,
      payload: {}
    });
  }
}
