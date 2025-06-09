import type { IPoint } from '@js-basics/vector';
import type { DisplayOptions } from '../lib/classes/Display';
import type { SharedBuffer, UseToolMeta } from './main';
import type { BrushSelect, ColorSelect, TOOLS, ToolSelect } from './select';
import type { ToolUseOptions } from '../lib/classes/Tool';
import type { AppState } from '../lib/App';
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BasePayload {}

export interface InitPayload extends BasePayload {
  debug: boolean;
}
export type InitSuccessPayload = BasePayload;

export interface InitDisplayPayload extends BasePayload {
  debug: boolean;
  options: DisplayOptions;
  canvas: OffscreenCanvas;
  port: MessagePort;
}
export type InitDisplaySucessPayload = BasePayload;

export interface DrawRectanglePayload extends BasePayload {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}
export type DrawRectangleSuccessPayload = BasePayload;

export interface LoadImagePayload extends BasePayload {
  imageBitmap: ImageBitmap;
}
export type LoadImageSuccessPayload = BasePayload;

export interface SetZoomPayload extends BasePayload {
  zoomLevel: number;
  position: IPoint & number;
}
export interface SetZoomSuccessPayload extends BasePayload {
  currentZoomLevel: number;
  position: IPoint & number;
}

export interface SetPositionPayload extends BasePayload {
  /**
   * Normalized position in the display. 0.1 is 10% of the display width/height.
   */
  position: IPoint & number;
}
export type SetPositionSuccessPayload = BasePayload;

export interface RefreshPayload extends BasePayload {
  dimension: { x: number; y: number };
  density: number;
}
export type RefreshSucessPayload = BasePayload;

export interface DrawImagePayload extends BasePayload {
  imageBitmap: ImageBitmap;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type DisplayDebugPayload = BasePayload;
export type DisplayDebugSuccessPayload = BasePayload;

export interface ReplaceCanvasPayload extends BasePayload {
  canvas: OffscreenCanvas;
}
export type ReplaceCanvasSuccessPayload = BasePayload;

export interface UpdateBufferPayload extends BasePayload {
  sharedBuffer: SharedBuffer;
}
export type UpdateBufferSuccessPayload = BasePayload;

export type UpdateCanvasPayload = BasePayload;
export type UpdateCanvasSuccessPayload = BasePayload;

export interface AddDisplayWorkerPortPayload {
  port: MessagePort;
}
export type AddDisplayWorkerPortSuccessPayload = BasePayload;

export enum STACK_ACTION {
  START = 'start',
  STOP = 'stop',
  FORWARD = 'forward',
  BACKWARD = 'backward'
}
export interface StackPayload extends BasePayload {
  action: STACK_ACTION;
}
export type StackSuccessPayload = BasePayload;

export interface SetOptionsPayload extends BasePayload {
  tool?: ToolSelect;
  brush?: BrushSelect;
  color?: ColorSelect;
}
export type SetOptionsSuccessPayload = BasePayload;

export interface UseToolPayload<
  TOptions extends ToolUseOptions = ToolUseOptions
> extends BasePayload {
  tool: TOOLS;
  toolOptions: TOptions;
  meta?: UseToolMeta;
}
export type UseToolSuccessPayload = BasePayload;

export interface SyncStatePayload extends BasePayload, AppState {}
export type SyncStateSuccessPayload = BasePayload;
