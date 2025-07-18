import type { IPoint } from '@js-basics/vector';
import type {
  WorkerIncomingPostMessage,
  WorkerOutgoingPostMessage
} from '../worker';
import type { DisplayWorkerIncomingAction } from '../worker.message.display';
import type { ManagerWorkerIncomingAction } from '../worker.message.workerManager';
import type { BrushSelect, ColorSelect, ToolSelect } from '../select';

import type { UseToolPayload } from '../worker.payload';
import type Stacker from '../../lib/classes/Stacker';
import type Color from '../../lib/classes/Color';
import type BrushDescription from '../../lib/classes/BrushDescription';

export interface Context {
  debug: boolean;
  displayWorkerPorts: MessagePort[];
  /**
   * The shared buffer is a SharedArrayBuffer that is used to store the current state of the canvas.
   * It is used to share the canvas state between the main thread and the display worker.
   */
  sharedBuffer?: SharedBuffer;
  /**
   * A source shared buffer that is used to restore the canvas to its initial state.
   * It is created when the shared buffer is set and is used to restore the canvas to its initial state.
   * It is a copy of the shared buffer and is not modified.
   * It is used to restore the canvas to its initial state and includes stack limits.
   */
  tmpSharedBuffer?: SharedBuffer;
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
  // brush?: BrushSelect;
  useOptions: SelectOptions;
  brushDescription?: BrushDescription;

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

  // #region views

  setView(view: Uint8Array | Uint8ClampedArray): void;
  createTmpView(): Uint8Array;
  updateTmpView(): void;

  // #endregion

  // #region getters
  removeTmpView(): void;
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

  // #region display
  setupDisplays: () => Promise<void>;
  updateDisplays: () => Promise<void>;
  // endregion

  // #region client
  updateClient: () => void;
  // #endregion
}

export interface SharedBuffer {
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
