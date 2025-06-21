import type { IPoint } from '@js-basics/vector';
import type { DomEvents } from '@web-workbench/core/services/domEvents';
import type { App } from '../App';
import type { TOOLS, ToolSelect } from '../../types/select';

import { WORKER_ACTION_TYPE } from '../../types/worker';
import {
  STACK_ACTION,
  type StackPayload,
  type UseToolPayload
} from '../../types/worker.payload';
import type { ActionCommandToMainWorker } from '../../types/worker.message.main';

export interface ToolEvent {
  /**
   * Display dimension in pixels.
   */
  dimension: IPoint & number;
  ctx: CanvasRenderingContext2D;
}
export interface ToolPointerEvent extends ToolEvent {
  /**
   * Display zoom level.
   */
  zoomLevel: number;
  /**
   * Position in pixels relative to the display.
   */
  position: IPoint & number;
  /**
   * Normalized position in the display. 0.1 is 10% of the display width/height.
   */
  normalizedPosition: IPoint & number;
  normalizePosition: (point: IPoint & number) => IPoint & number;
  unnormalizePosition: (point: IPoint & number) => IPoint & number;

  normalizeDimension: (point: IPoint & number) => IPoint & number;
  unnormalizeDimension: (point: IPoint & number) => IPoint & number;

  positionToRealPosition: (point: IPoint & number) => IPoint & number;
  realPositionToPosition: (point: IPoint & number) => IPoint & number;
  fixedPosition: (point: IPoint & number) => IPoint & number;
  fixedDimension: (point: IPoint & number) => IPoint & number;
  fixedRealPosition: (point: IPoint & number) => IPoint & number;
}

export interface ToolConstructorOptions<
  TOptions extends ToolUseOptions = ToolUseOptions
> {
  type: TOOLS;
  app: App;
  domEvents: DomEvents;
  options: TOptions;
}

export type ToolUseOptions = {
  stackable?: boolean;
  passive?: boolean;
};

export default class Tool<TOptions extends ToolUseOptions = ToolUseOptions> {
  type: TOOLS;
  app: App;
  domEvents: DomEvents;
  options: TOptions;

  constructor({
    type,
    app,
    domEvents,
    options
  }: ToolConstructorOptions<TOptions>) {
    this.type = type;
    this.app = app;
    this.domEvents = domEvents;
    this.options = options || ({} as TOptions);
  }

  destroy() {
    // Clean up any resources or listeners
  }

  getDisplay() {
    return this.app.currentDisplay!;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  click(e: MouseEvent, value: ToolSelect) {
    // Method to be implemented by subclasses
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async pointerDown(e: ToolPointerEvent) {
    // Method to be implemented by subclasses
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async pointerUp(e: ToolPointerEvent) {
    // Method to be implemented by subclasses
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pointerMove(e: ToolPointerEvent) {
    // Method to be implemented by subclasses
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  contextMenu(e: ToolPointerEvent) {
    // Method to be implemented by subclasses
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pointerCancel(e: ToolEvent) {
    // Method to be implemented by subclasses
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cancel(e: ToolEvent) {
    // Method to be implemented by subclasses
  }

  reset(e: ToolEvent | ToolPointerEvent) {
    e.ctx.clearRect(0, 0, e.ctx.canvas.width, e.ctx.canvas.height);
  }

  /**
   * Send an action to the main worker to use the tool.
   * @param dimension The dimension of the display in pixels.
   * @param normalizedPosition The position in the display normalized to [0, 1].
   * @param options Additional options for the action.
   */
  action(
    { dimension, normalizedPosition }: ToolPointerEvent,
    options: Partial<TOptions> = {}
  ) {
    const toolOptions: TOptions = {
      ...this.options,
      ...options
    };

    const workerManager = this.app.workerManager;
    const display = this.getDisplay();
    workerManager.action<
      ActionCommandToMainWorker<
        UseToolPayload<TOptions>,
        WORKER_ACTION_TYPE.USE_TOOL
      >
    >({
      type: WORKER_ACTION_TYPE.USE_TOOL,
      payload: {
        tool: this.type,
        toolOptions,
        meta: {
          dimension,
          displayPosition: display.options.position,
          position: normalizedPosition,
          zoomLevel: display.currentZoomLevel
        }
      }
    });
  }

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
}
