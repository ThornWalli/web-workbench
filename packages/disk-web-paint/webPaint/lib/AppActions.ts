import { STACK_ACTION } from '../types/worker.payload';
import type {
  GetColorsPayload,
  GetColorsSuccessPayload,
  ResizeCanvasPayload,
  ResizePayload,
  GetDataPayload,
  GetDataSuccessPayload,
  SetOptionsPayload,
  StackPayload,
  ResizeSuccessPayload,
  ResizeCanvasSuccessPayload,
  InsertImageSuccessPayload,
  InsertImagePayload
} from '../types/worker.payload';
import { WORKER_ACTION_TYPE } from '../types/worker';
import type { ActionSuccess } from '../types/worker';
import type { ActionCommandToMainWorker } from '../types/worker.message.main';
import type { App } from './App';

export default class AppActions {
  constructor(private app: App) {}

  startStack() {
    return this.app.workerManager.action<{
      type: WORKER_ACTION_TYPE.STACK;
      payload: StackPayload;
    }>({
      type: WORKER_ACTION_TYPE.STACK,
      payload: {
        action: STACK_ACTION.START
      }
    });
  }

  stopStack() {
    return this.app.workerManager.action<{
      type: WORKER_ACTION_TYPE.STACK;
      payload: StackPayload;
    }>({
      type: WORKER_ACTION_TYPE.STACK,
      payload: {
        action: STACK_ACTION.STOP
      }
    });
  }

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

  insertImage(payload: InsertImagePayload) {
    return this.app.workerManager.action<
      ActionCommandToMainWorker<
        InsertImagePayload,
        WORKER_ACTION_TYPE.INSERT_IMAGE
      >,
      ActionSuccess<
        InsertImageSuccessPayload,
        WORKER_ACTION_TYPE.INSERT_IMAGE_SUCCESS
      >
    >({
      type: WORKER_ACTION_TYPE.INSERT_IMAGE,
      payload
    });
  }

  resize(payload: ResizePayload) {
    return this.app.workerManager.action<
      ActionCommandToMainWorker<ResizePayload, WORKER_ACTION_TYPE.RESIZE>,
      ActionSuccess<ResizeSuccessPayload, WORKER_ACTION_TYPE.RESIZE_SUCCESS>
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
      >,
      ActionSuccess<
        ResizeCanvasSuccessPayload,
        WORKER_ACTION_TYPE.RESIZE_CANVAS_SUCCESS
      >
    >({
      type: WORKER_ACTION_TYPE.RESIZE_CANVAS,
      payload
    });
  }

  async getColors() {
    const test = await this.app.workerManager.action<
      ActionCommandToMainWorker<
        GetColorsPayload,
        WORKER_ACTION_TYPE.GET_COLORS
      >,
      ActionSuccess<
        GetColorsSuccessPayload,
        WORKER_ACTION_TYPE.GET_COLORS_SUCCESS
      >
    >({
      type: WORKER_ACTION_TYPE.GET_COLORS,
      payload: {}
    });
    return test;
  }
}
