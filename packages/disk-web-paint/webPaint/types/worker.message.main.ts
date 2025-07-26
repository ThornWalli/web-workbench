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
  ImageOperationPayload,
  InsertImagePayload,
  RotatePayload,
  FlipPayload,
  SelectLayerPayload,
  AddLayerPayload,
  RemoveLayerPayload,
  GetLayersPayload,
  LoadDocumentPayload,
  MoveLayersPayload,
  UpdateLayerPayload,
  MergeLayersPayload,
  DuplicateLayerPayload,
  GetOverviewLayersPayload
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
  | ActionCommandToMainWorker<
      InsertImagePayload,
      WORKER_ACTION_TYPE.INSERT_IMAGE
    >
  | ActionCommandToMainWorker<ResizePayload, WORKER_ACTION_TYPE.RESIZE>
  | ActionCommandToMainWorker<
      ResizeCanvasPayload,
      WORKER_ACTION_TYPE.RESIZE_CANVAS
    >
  | ActionCommandToMainWorker<GetColorsPayload, WORKER_ACTION_TYPE.GET_COLORS>
  | ActionCommandToMainWorker<
      ImageOperationPayload,
      WORKER_ACTION_TYPE.IMAGE_OPERATION
    >
  | ActionCommandToMainWorker<RotatePayload, WORKER_ACTION_TYPE.ROTATE>
  | ActionCommandToMainWorker<FlipPayload, WORKER_ACTION_TYPE.FLIP>
  | ActionCommandToMainWorker<
      SelectLayerPayload,
      WORKER_ACTION_TYPE.SELECT_LAYER
    >
  | ActionCommandToMainWorker<AddLayerPayload, WORKER_ACTION_TYPE.ADD_LAYER>
  | ActionCommandToMainWorker<
      RemoveLayerPayload,
      WORKER_ACTION_TYPE.REMOVE_LAYER
    >
  | ActionCommandToMainWorker<GetLayersPayload, WORKER_ACTION_TYPE.GET_LAYERS>
  | ActionCommandToMainWorker<
      UpdateLayerPayload,
      WORKER_ACTION_TYPE.UPDATE_LAYER
    >
  | ActionCommandToMainWorker<MoveLayersPayload, WORKER_ACTION_TYPE.MOVE_LAYERS>
  | ActionCommandToMainWorker<
      DuplicateLayerPayload,
      WORKER_ACTION_TYPE.DUPLICATE_LAYER
    >
  | ActionCommandToMainWorker<
      MergeLayersPayload,
      WORKER_ACTION_TYPE.MERGE_LAYERS
    >
  | ActionCommandToMainWorker<
      LoadDocumentPayload,
      WORKER_ACTION_TYPE.LOAD_DOCUMENT
    >
  | ActionCommandToMainWorker<
      GetOverviewLayersPayload,
      WORKER_ACTION_TYPE.GET_OVERVIEW_LAYERS
    >;
