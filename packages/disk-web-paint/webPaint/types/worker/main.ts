import type { IPoint } from '@js-basics/vector';
import type {
  WorkerIncomingPostMessage,
  WorkerOutgoingPostMessage
} from '../worker';
import type { DisplayWorkerIncomingAction } from '../worker.message.display';
import type { ManagerWorkerIncomingAction } from '../worker.message.workerManager';
import type {
  BLEND_MODE,
  BrushSelect,
  ColorSelect,
  ToolSelect
} from '../select';

import type { UseToolPayload } from '../worker.payload';
import type Stacker from '../../lib/classes/Stacker';
import type Color from '../../lib/classes/Color';
import type BrushDescription from '../../lib/classes/BrushDescription';
import type { LayerDescription } from '../layer';

export interface ILayer {
  order: number;
  locked: boolean;
  id: string;
  name: string;
  opacity: number;
  visible: boolean;
  blendMode: BLEND_MODE;
  buffer: BufferDescription;
  tmpBuffer: BufferDescription;

  /**
   * The view is a Uint8ClampedArray that represents the current state of the canvas.
   */
  view?: Uint8Array;
  /**
   * The last view is a Uint8ClampedArray that represents the last state of the canvas.
   */
  lastView?: Uint8Array;
  /**
   * The temporary view is a Uint8ClampedArray that is used to store the current state of the canvas
   * when the user is interacting with the canvas.
   * It is used to store the current state of the canvas when the user is interacting with the canvas.
   */
  tmpView?: Uint8Array;

  get dimension(): IPoint & number;

  setSharedBuffer(buffer: SharedArrayBuffer, dimension: IPoint & number): void;

  // #region views

  setView(view: Uint8Array | Uint8ClampedArray): void;
  createTmpView(): Uint8Array;
  updateTmpView(): void;
  removeTmpView(): void;

  // #endregion

  toJSON(): LayerDescription;
}

export interface ILayerManager {
  buffer: BufferDescription;
  view: Uint8Array<ArrayBufferLike>;
  layers: ILayer[];
  layerMap: Map<string, ILayer>;

  get beforeView(): Uint8Array | undefined;
  get afterView(): Uint8Array | undefined;

  getCurrentLayerId(): string | undefined;
  setCurrentLayerId(layerId: string): void;

  get currentLayer(): ILayer | undefined;
  addLayer(options?: {
    id?: string;
    name: string;
    buffer?: SharedArrayBuffer;
    dimension: IPoint & number;
  }): ILayer;
  removeLayer(layerId: string): void;

  selectLayer(layerId: string): void;
  getLayerById(layerId: string): ILayer | undefined;
  setLayers(layers: ILayer[]): void;
}

export interface IContext {
  debug: boolean;
  displayWorkerPorts: MessagePort[];
  /**
   * The shared buffer is a SharedArrayBuffer that is used to store the current state of the canvas.
   * It is used to share the canvas state between the main thread and the display worker.
   * @deprecated Use Layer
   */
  get sharedBuffer(): BufferDescription | undefined;
  // sharedBuffer?: SharedBuffer;
  /**
   * A source shared buffer that is used to restore the canvas to its initial state.
   * It is created when the shared buffer is set and is used to restore the canvas to its initial state.
   * It is a copy of the shared buffer and is not modified.
   * It is used to restore the canvas to its initial state and includes stack limits.
   */
  get tmpSharedBuffer(): BufferDescription | undefined;
  // tmpSharedBuffer?: SharedBuffer;
  /**
   * The view is a Uint8ClampedArray that represents the current state of the canvas.
   * @deprecated Use Layer
   */
  get view(): Uint8Array | undefined;
  // view?: Uint8Array;
  // get view(): Uint8Array;

  /**
   * The last view is a Uint8ClampedArray that represents the last state of the canvas.
   * @deprecated Use Layer
   */
  get lastView(): Uint8Array | undefined;
  // lastView?: Uint8Array;
  /**
   * The temporary view is a Uint8ClampedArray that is used to store the current state of the canvas
   * when the user is interacting with the canvas.
   * It is used to store the current state of the canvas when the user is interacting with the canvas.
   * @deprecated Use Layer
   */
  get tmpView(): Uint8Array | undefined;
  // tmpView?: Uint8Array;
  // brush?: BrushSelect;
  useOptions: SelectOptions;
  brushDescription?: BrushDescription;

  layerManager: ILayerManager;

  // #region stack
  actionStack: Stacker<StackItem>;
  addActionStack(name: string, payload: UseToolPayload): void;
  // #endregion

  setBrush(brush: BrushSelect, brushColor?: ColorSelect): void;
  // #region setters
  setSelectOptions(options: Partial<SelectOptions>): void;
  setSharedBuffer(buffer: SharedArrayBuffer, dimension: IPoint & number): void;

  getColorByPosition(
    position: IPoint & number,
    dimension?: IPoint & number
  ): Color | undefined;

  // #endregion

  // #region layers
  /**
   * The layers are an array of Layer objects that represent the layers of the canvas.
   */
  // layers: ILayer[];
  // layerMap: Map<string, ILayer>;
  // currentLayerId?: string;
  // get currentLayer(): ILayer | undefined;
  // getLayerById(layerId: string): ILayer | undefined;
  // addLayer(options?: {
  //   name: string;
  //   buffer?: SharedArrayBuffer;
  //   dimension: IPoint & number;
  // }): ILayer;
  // removeLayer(layerId: string): void;
  // selectLayer(layerId: string): void;
  // setLayers(layers: ILayer[]): void;
  // removeLayer(layerId: string): void;
  // getLayerById(layerId: string): ILayer | undefined;
  // getLayerByIndex(index: number): ILayer | undefined;

  // #endregion

  // #region views
  /**
   * @deprecated Use Layer
   */
  setView(view: Uint8Array | Uint8ClampedArray): void;
  /**
   * @deprecated Use Layer
   */
  createTmpView(): Uint8Array;
  /**
   * @deprecated Use Layer
   */
  updateTmpView(): void;
  /**
   * @deprecated Use Layer
   */
  removeTmpView(): void;

  // #endregion

  // #region getters
  getDimension(): IPoint & number;
  getTargetPosition(
    position: IPoint & number,
    toolMeta: UseToolMeta,
    options?: { round?: boolean }
  ): IPoint & number;
  getTargetDimension(
    position: IPoint & number,
    options: UseToolMeta
  ): IPoint & number;
  // #endregion

  // #region methods
  getColorAtPosition(position: IPoint): Color | undefined;
  isIntersect(position: IPoint & number): boolean;
  // #endregion

  // #region actions
  action: (
    message: WorkerOutgoingPostMessage<ManagerWorkerIncomingAction>,
    transfer?: Transferable[]
  ) => void;
  actionDisplay: (
    displayPort: MessagePort,
    message:
      | WorkerIncomingPostMessage<DisplayWorkerIncomingAction>
      | WorkerIncomingPostMessage<DisplayWorkerIncomingAction>,
    transfer?: Transferable[]
  ) => void;
  // #endregion

  update: (options?: {
    client?: boolean;
    ignoreLayers?: boolean;
  }) => Promise<void>;

  // #region display
  setupDisplays: () => Promise<void>;
  updateDisplays: () => Promise<void>;
  // endregion

  // #region client
  updateClient: () => Promise<void>;
  // #endregion
}

export interface BufferDescription {
  buffer: SharedArrayBuffer;
  dimension: IPoint & number;
}
export interface SelectOptions {
  tool: ToolSelect;
  brush: BrushSelect;
  color: ColorSelect;
}

export enum ROTATE_TYPE {
  ROTATE_90_DEGRESS = 0,
  ROTATE_180_DEGRESS = 1,
  ROTATE_270_DEGRESS = 2
}

export enum FLIP_TYPE {
  HORIZONTAL = 0,
  VERTICAL = 1
}

export enum RESIZE_TYPE {
  NEAREST_NEIGHBOR = 'nearestNeighbor',
  BILINEAR = 'bilinear',
  BICUBIC = 'bicubic',
  LANCZOS = 'lanczos'
}

export interface UseToolMeta {
  /**
   * Position in pixels relative to the display.
   */
  position: IPoint & number;
  displayPosition: IPoint & number;
  /**
   * Display dimension in pixels.
   */
  dimension: IPoint & number;
  /**
   * Display zoom level.
   */
  zoomLevel: number;

  /**
   * The seed is used to generate random numbers for the tool.
   * It is used to generate random numbers for the tool.
   */
  seed: number;
}

export interface StackItem {
  name: string;
  payload: UseToolPayload;
  selectOptions: SelectOptions;
}

export enum IMAGE_OPERATION {
  GRAYSCALE = 'grayscale',
  INVERT = 'invert',
  SEPIA = 'sepia',
  BRIGHTNESS = 'brightness',
  CONTRAST = 'contrast',
  SATURATION = 'saturation',
  SHARPEN = 'sharpen',
  BLUR = 'blur',
  EMBOSS = 'emboss',
  ROTATE = 'rotate',
  FLIP = 'flip',
  /**
   * @deprecated Not implemented yet
   */
  EDGE_DETECT = 'edge_detect',
  /**
   * @deprecated Not implemented yet
   */
  THRESHOLD = 'threshold',
  /**
   * @deprecated Not implemented yet
   */
  COLORIZE = 'colorize',
  /**
   * @deprecated Not implemented yet
   */
  CUSTOM = 'custom'
}
