import type { IPoint } from '@js-basics/vector';
import type { DomEvents } from '@web-workbench/core/services/domEvents';
import type { App } from '../App';
import type { TOOLS, ToolSelect } from '../../types/select';
import type WorkerManager from './WorkerManager';
import { WORKER_ACTION_TYPE } from '../../types/worker';
import { STACK_ACTION, type StackPayload } from '../../types/worker.payload';

export interface ToolPointerEvent {
  /**
   * Display dimension in pixels.
   */
  dimension: IPoint & number;
  /**
   * Position in pixels relative to the display.
   */
  position: IPoint & number;
  /**
   * Normalized position in the display. 0.1 is 10% of the display width/height.
   */
  normalizedPosition: IPoint & number;
  ctx: CanvasRenderingContext2D;
  normalizePosition: (point: IPoint & number) => IPoint & number;
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
    this.options = options;
  }

  getDisplay() {
    return this.app.currentDisplay!;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClick(e: MouseEvent, value: ToolSelect) {
    // Method to be implemented by subclasses
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async pointerDown(e: ToolPointerEvent) {
    if (this.options.stackable) {
      await startStack(this.app.workerManager);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async pointerUp(e: ToolPointerEvent) {
    if (this.options.stackable) {
      await stopStack(this.app.workerManager);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pointerMove(e: ToolPointerEvent) {
    // Method to be implemented by subclasses
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  contextMenu(e: ToolPointerEvent) {
    // Method to be implemented by subclasses
  }

  cancel() {
    // Method to be implemented by subclasses
  }
}

export function startStack(workerManager: WorkerManager) {
  workerManager.action<{
    type: WORKER_ACTION_TYPE.STACK;
    payload: StackPayload;
  }>({
    type: WORKER_ACTION_TYPE.STACK,
    payload: {
      action: STACK_ACTION.START
    }
  });
}

export function stopStack(workerManager: WorkerManager) {
  workerManager.action<{
    type: WORKER_ACTION_TYPE.STACK;
    payload: StackPayload;
  }>({
    type: WORKER_ACTION_TYPE.STACK,
    payload: {
      action: STACK_ACTION.STOP
    }
  });
}
