import { WORKER_ACTION_TYPE } from '../types/worker';
import type { ActionCommandToMainWorker } from '../types/worker.message.main';
import {
  STACK_ACTION,
  type SetOptionsPayload,
  type StackPayload
} from '../types/worker.payload';
import type { App } from './App';

export default class AppActions {
  constructor(private app: App) {}
  stackUndo() {
    return this.app.workerManager.action<
      ActionCommandToMainWorker<StackPayload>
    >({
      type: WORKER_ACTION_TYPE.STACK,
      payload: {
        action: STACK_ACTION.BACKWARD
      }
    });
  }
  stackRedo() {
    return this.app.workerManager.action<
      ActionCommandToMainWorker<StackPayload>
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
}
