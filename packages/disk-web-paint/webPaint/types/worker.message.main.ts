import type { WORKER_ACTION_TYPE } from './worker';
import type {
  AddDisplayWorkerPortPayload,
  BasePayload,
  InitPayload,
  LoadImagePayload,
  StackPayload,
  SetOptionsPayload,
  UseToolPayload,
  ResizeCanvasPayload,
  ResizePayload,
  GetColorsPayload,
  ImageOperationPayload
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
  | ActionCommandToMainWorker<StackPayload, WORKER_ACTION_TYPE.STACK>
  | ActionCommandToMainWorker<StackPayload, WORKER_ACTION_TYPE.GET_DATA>
  | ActionCommandToMainWorker<
      SetOptionsPayload,
      WORKER_ACTION_TYPE.SET_SELECT_OPTIONS
    >
  | ActionCommandToMainWorker<UseToolPayload, WORKER_ACTION_TYPE.USE_TOOL>
  | ActionCommandToMainWorker<LoadImagePayload, WORKER_ACTION_TYPE.LOAD_IMAGE>
  | ActionCommandToMainWorker<InitPayload, WORKER_ACTION_TYPE.INIT>
  | ActionCommandToMainWorker<ResizePayload, WORKER_ACTION_TYPE.RESIZE>
  | ActionCommandToMainWorker<
      ResizeCanvasPayload,
      WORKER_ACTION_TYPE.RESIZE_CANVAS
    >
  | ActionCommandToMainWorker<GetColorsPayload, WORKER_ACTION_TYPE.GET_COLORS>
  | ActionCommandToMainWorker<
      ImageOperationPayload,
      WORKER_ACTION_TYPE.IMAGE_OPERATION
    >;
