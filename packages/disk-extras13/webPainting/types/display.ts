import type { IPoint } from '@js-basics/vector';
import type {
  DisplayOptions,
  TransferableOptions as DisplayTransferableOptions
} from '../lib/classes/Display';
import type { DisplayOutgoingPostMessage } from './worker';
import type { MainWorkerIncomingAction } from './worker.message.main';
import type { ClientIncomingAction } from './worker.message.client';

export interface Context {
  options: DisplayOptions;
  lastImageData?: ImageData;
  offscreenCanvas?: OffscreenCanvas;
  ctx?: OffscreenCanvasRenderingContext2D | null;
  // Methods
  getDimensionImageData(scaled?: boolean): IPoint & number;
  getDimensionOffscreenCanvas(): IPoint & number;

  precisionNumber(value: number): number;

  setOptions(options: Partial<DisplayTransferableOptions>): void;
  setZoom(position: IPoint & number, value: number): void;
  setPosition(position: IPoint & number): void;
  draw(imageData?: ImageData): void;
  mainWorkerPort?: MessagePort;
  action(
    message:
      | DisplayOutgoingPostMessage<MainWorkerIncomingAction>
      | DisplayOutgoingPostMessage<ClientIncomingAction>,
    transfer?: Transferable[]
  ): void;
}
