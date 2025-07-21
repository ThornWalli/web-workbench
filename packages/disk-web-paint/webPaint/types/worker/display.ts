import type { IPoint } from '@js-basics/vector';
import type DisplayOptions from '../../lib/classes/DisplayOptions';
import type { DisplayOutgoingPostMessage } from '../worker';
import type { MainWorkerIncomingAction } from '../worker.message.main';
import type { ClientIncomingAction } from '../worker.message.client';
import type { BufferDescription } from './main';
import type {
  LayerDisplayDescription,
  LayerDisplayImportDescription
} from '../layer';

export interface IContext {
  isReady: () => boolean;
  debug: boolean;
  options: DisplayOptions;
  currentZoomLevel: number;
  lastImageData?: ImageData;
  canvas?: OffscreenCanvas;
  ctx?: OffscreenCanvasRenderingContext2D | null;
  mainWorkerPort?: MessagePort;

  view?: Uint8ClampedArray;
  bufferDescription?: BufferDescription;

  layers: LayerDisplayDescription[];

  // #region getters
  getDimensionImageData(scaled?: boolean): IPoint & number;
  getDimensionOffscreenCanvas(): IPoint & number;
  // #endregion

  // #region setters
  setSharedBuffer(bufferDescriptions: BufferDescription): void;
  setLayers(importLayers: LayerDisplayImportDescription[]): void;
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
