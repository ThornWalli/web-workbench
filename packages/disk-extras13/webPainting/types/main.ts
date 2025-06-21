import type { IPoint } from '@js-basics/vector';
import type {
  WorkerIncomingPostMessage,
  WorkerOutgoingPostMessage
} from './worker';
import type { DisplayWorkerIncomingAction } from './worker.message.display';
import type { ManagerWorkerIncomingAction } from './worker.message.workerManager';
import type { BrushSelect, ColorSelect, ToolSelect } from './select';
import type BrushDescription from '../lib/classes/BrushDescription';
import type { UseToolPayload } from './worker.payload';
import type Stacker from '../lib/classes/Stacker';
import type { Color } from '../lib/classes/Color';

export interface SharedBuffer {
  buffer: SharedArrayBuffer;
  dimension: IPoint & number;
}
export interface SelectOptions {
  tool: ToolSelect;
  brush: BrushSelect;
  color: ColorSelect;
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
  brush?: BrushDescription;
}

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
  view?: Uint8ClampedArray;
  brush?: BrushDescription;
  useOptions: SelectOptions;

  // #region stack
  actionStack: Stacker<StackItem>;
  addActionStack(name: string, payload: UseToolPayload): void;
  // #endregion

  // #region setters
  setSelectOptions(options: Partial<SelectOptions>): void;
  setSharedBuffer(buffer: SharedArrayBuffer, dimension: IPoint & number): void;

  getColorByPosition(
    position: IPoint & number,
    dimension?: IPoint & number
  ): Color | undefined;
  getDataRGBA(
    position: IPoint & number,
    dimension?: IPoint & number
  ): Uint8ClampedArray;
  setDataRGB(
    position: IPoint & number,
    brushData: Uint8ClampedArray,
    brushSize: IPoint & number
  ): void;
  setDataRGBA(
    position: IPoint & number,
    data: Uint8ClampedArray,
    dataSize: IPoint & number,
    replace?: boolean
  ): void;
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
