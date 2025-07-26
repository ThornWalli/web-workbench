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
  InsertImagePayload,
  FlipPayload,
  FlipSuccessPayload,
  RotatePayload,
  RotateSuccessPayload,
  UpdateLayerPayload,
  SelectLayerPayload,
  MoveLayersPayload,
  AddLayerPayload,
  RemoveLayerPayload,
  GetLayersSuccessPayload,
  GetLayersPayload,
  MergeLayersPayload,
  DuplicateLayerPayload,
  GetOverviewLayersPayload
} from '../types/worker.payload';
import { WORKER_ACTION_TYPE } from '../types/worker';
import type { ActionSuccess } from '../types/worker';
import type { ActionCommandToMainWorker } from '../types/worker.message.main';
import type { App } from './App';
import type { FLIP_TYPE, ROTATE_TYPE } from '../types/worker/main';
import type { LayerDescription } from '../types/layer';

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

  abortStack() {
    return this.app.workerManager.action<{
      type: WORKER_ACTION_TYPE.STACK;
      payload: StackPayload;
    }>({
      type: WORKER_ACTION_TYPE.STACK,
      payload: {
        action: STACK_ACTION.ABORT
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

  flip(type: FLIP_TYPE) {
    return this.app.workerManager.action<
      ActionCommandToMainWorker<FlipPayload, WORKER_ACTION_TYPE.FLIP>,
      ActionSuccess<FlipSuccessPayload, WORKER_ACTION_TYPE.FLIP_SUCCESS>
    >({
      type: WORKER_ACTION_TYPE.FLIP,
      payload: { type }
    });
  }

  rotate(type: ROTATE_TYPE) {
    return this.app.workerManager.action<
      ActionCommandToMainWorker<RotatePayload, WORKER_ACTION_TYPE.ROTATE>,
      ActionSuccess<RotateSuccessPayload, WORKER_ACTION_TYPE.ROTATE_SUCCESS>
    >({
      type: WORKER_ACTION_TYPE.ROTATE,
      payload: { type }
    });
  }

  async getColors() {
    return this.app.workerManager.action<
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
  }

  // #region Layer Actions

  selectLayer(id: string) {
    return this.app.workerManager.action<
      ActionCommandToMainWorker<
        SelectLayerPayload,
        WORKER_ACTION_TYPE.SELECT_LAYER
      >
    >({
      type: WORKER_ACTION_TYPE.SELECT_LAYER,
      payload: { id }
    });
  }

  updateLayer(id: string, data: Partial<LayerDescription>) {
    return this.app.workerManager.action<
      ActionCommandToMainWorker<
        UpdateLayerPayload,
        WORKER_ACTION_TYPE.UPDATE_LAYER
      >
    >({
      type: WORKER_ACTION_TYPE.UPDATE_LAYER,
      payload: {
        id,
        data: {
          ...this.app.state.layers.find(layer => layer.id === id),
          ...data
        }
      }
    });
  }

  moveLayers(layers: LayerDescription[]) {
    return this.app.workerManager.action<
      ActionCommandToMainWorker<
        MoveLayersPayload,
        WORKER_ACTION_TYPE.MOVE_LAYERS
      >
    >({
      type: WORKER_ACTION_TYPE.MOVE_LAYERS,
      payload: { layers }
    });
  }

  addLayer(options: { name: string; dimension: { x: number; y: number } }) {
    return this.app.workerManager.action<
      ActionCommandToMainWorker<AddLayerPayload, WORKER_ACTION_TYPE.ADD_LAYER>
    >({
      type: WORKER_ACTION_TYPE.ADD_LAYER,
      payload: {
        name: options.name
      }
    });
  }

  removeLayer(id: string) {
    return this.app.workerManager.action<
      ActionCommandToMainWorker<
        RemoveLayerPayload,
        WORKER_ACTION_TYPE.REMOVE_LAYER
      >
    >({
      type: WORKER_ACTION_TYPE.REMOVE_LAYER,
      payload: { id }
    });
  }

  getLayers() {
    return this.app.workerManager.action<
      ActionCommandToMainWorker<
        GetLayersPayload,
        WORKER_ACTION_TYPE.GET_LAYERS
      >,
      ActionSuccess<
        GetLayersSuccessPayload,
        WORKER_ACTION_TYPE.GET_LAYERS_SUCCESS
      >
    >({
      type: WORKER_ACTION_TYPE.GET_LAYERS,
      payload: {}
    });
  }

  getOverviewLayers(width: number) {
    return this.app.workerManager.action<
      ActionCommandToMainWorker<
        GetOverviewLayersPayload,
        WORKER_ACTION_TYPE.GET_OVERVIEW_LAYERS
      >,
      ActionSuccess<
        GetLayersSuccessPayload,
        WORKER_ACTION_TYPE.GET_OVERVIEW_LAYERS_SUCCESS
      >
    >({
      type: WORKER_ACTION_TYPE.GET_OVERVIEW_LAYERS,
      payload: {
        width
      }
    });
  }

  duplicateLayer(id: string) {
    return this.app.workerManager.action<
      ActionCommandToMainWorker<
        DuplicateLayerPayload,
        WORKER_ACTION_TYPE.DUPLICATE_LAYER
      >
    >({
      type: WORKER_ACTION_TYPE.DUPLICATE_LAYER,
      payload: { id }
    });
  }

  mergeLayers(ids: string[]) {
    return this.app.workerManager.action<
      ActionCommandToMainWorker<
        MergeLayersPayload,
        WORKER_ACTION_TYPE.MERGE_LAYERS
      >
    >({
      type: WORKER_ACTION_TYPE.MERGE_LAYERS,
      payload: { ids }
    });
  }

  // #endregion
}
