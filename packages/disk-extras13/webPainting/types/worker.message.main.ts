import type { WORKER_ACTION_TYPE } from './worker';
import type {
  AddDisplayWorkerPortPayload,
  BasePayload,
  DrawRectanglePayload,
  InitPayload,
  LoadImagePayload,
  ReplaceCanvasPayload
} from './worker.payload';

export interface ActionCommandToMainWorker<
  Payload extends BasePayload = BasePayload,
  Type = WORKER_ACTION_TYPE
> {
  type: Type;
  payload: Payload;
}

export type MainWorkerIncomingAction =
  | ActionCommandToMainWorker<
      AddDisplayWorkerPortPayload,
      WORKER_ACTION_TYPE.ADD_RENDER_WORKER_PORT
    >
  | ActionCommandToMainWorker<
      DrawRectanglePayload,
      WORKER_ACTION_TYPE.DRAW_RECTANGLE
    >
  | ActionCommandToMainWorker<LoadImagePayload, WORKER_ACTION_TYPE.LOAD_IMAGE>
  | ActionCommandToMainWorker<
      ReplaceCanvasPayload,
      WORKER_ACTION_TYPE.REPLACE_CANVAS
    >
  | ActionCommandToMainWorker<InitPayload, WORKER_ACTION_TYPE.INIT>;
