import type { IPoint } from '@js-basics/vector';
import type { DisplayOptions } from '../lib/classes/Display';
import type { DisplayOutgoingPostMessage } from './worker';
import type { MainWorkerIncomingAction } from './worker.message.main';
import type { ClientIncomingAction } from './worker.message.client';
import type { SharedBuffer } from './main';

export interface Context {
  debug: boolean;
  options: DisplayOptions;
  currentZoomLevel: number;
  lastImageData?: ImageData;
  canvas?: OffscreenCanvas;
  ctx?: OffscreenCanvasRenderingContext2D | null;
  view?: Uint8ClampedArray;
  sharedBuffer?: SharedBuffer;
  mainWorkerPort?: MessagePort;

  // #region getters
  getDimensionImageData(scaled?: boolean): IPoint & number;
  getDimensionOffscreenCanvas(): IPoint & number;
  // #endregion

  // #region setters
  setSharedBuffer(buffer: SharedBuffer): void;
  setOptions(options: Partial<DisplayOptions>): void;
  setZoom(position: IPoint & number, value: number, override?: boolean): void;
  setPosition(position: IPoint & number): void;
  // #endregion

  // #region methods
  precisionNumber(value: number): number;
  updateCanvas(): void;
  // #endregion

  // #region actions
  action(
    message:
      | DisplayOutgoingPostMessage<MainWorkerIncomingAction>
      | DisplayOutgoingPostMessage<ClientIncomingAction>,
    transfer?: Transferable[]
  ): void;
  // #endregion

  /**
   * @deprecated Use `updateCanvas` instead.
   */
  draw(imageData?: ImageData): void;
}
