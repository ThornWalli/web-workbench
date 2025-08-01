/* eslint-disable @typescript-eslint/no-unused-vars */
import { WORKER_ACTION_TYPE } from '../../../types/worker';
import type { IActionResult } from '../../../types/worker';
import type { ToolSelect } from '../../../types/select';
import Tool from '../Tool';
import type {
  ActionContext,
  ToolConstructorOptions,
  ToolEvent,
  ToolUseOptions
} from '../Tool';
import type { MainWorkerIncomingAction } from '../../../types/worker.message.main';
import type { ClientIncomingAction } from '../../../types/worker.message.client';
import { ipoint } from '@js-basics/vector';
import type { IPoint } from '@js-basics/vector';
import type ToolPointerEvent from '../ToolPointerEvent';

export interface InteractionActionContext extends ActionContext {
  event: ToolPointerEvent;
}
export interface InteractionOptions extends ToolUseOptions {
  lastPosition?: IPoint & number;
  clamp?: boolean;
}

export default class InteractionTool<
  TOptions extends InteractionOptions = InteractionOptions
> extends Tool<TOptions, InteractionActionContext> {
  interactingMove = false;
  currentEvent?: ToolPointerEvent;

  constructor({
    domEvents,
    interactingMove,
    ...options
  }: {
    interactingMove?: boolean;
  } & ToolConstructorOptions<TOptions>) {
    super({
      ...options,
      options: {
        lastPosition: ipoint(0, 0),
        clamp: false,
        ...options.options
      }
    });
    this.interactingMove = interactingMove ?? true;
    this.domEvents = domEvents;
  }

  /**
   * Wird verwendet wenn 'passive' aktiv ist.
   * Wird verwendet wenn Tool keiner weitere Aktion ausser ein Interaktion hat.
   */
  click(e: MouseEvent, value: ToolSelect) {
    // Method to be implemented by subclasses
  }

  async pointerDown(e: ToolPointerEvent) {
    this.currentEvent = e;
    this.options.lastPosition = e.getNormalizedPosition(this.options.clamp);
    // Method to be implemented by subclasses
  }
  async pointerUp(e: ToolPointerEvent) {
    this.currentEvent = e;
    this.options.lastPosition = e.getNormalizedPosition(this.options.clamp);
    // Method to be implemented by subclasses
  }

  pointerOver(e: ToolPointerEvent) {
    this.currentEvent = e;
    // Method to be implemented by subclasses
  }

  pointerMove(e: ToolPointerEvent) {
    this.currentEvent = e;
    this.options.lastPosition = e.getNormalizedPosition(this.options.clamp);
    // Method to be implemented by subclasses
  }

  pointerMoveStatic(e: ToolPointerEvent) {
    this.currentEvent = e;
    // this.options.lastPosition = e.getNormalizedPosition(this.options.clamp);

    // Method to be implemented by subclasses
  }

  contextMenu(e: ToolEvent) {
    // Method to be implemented by subclasses
  }
  pointerCancel(e: ToolEvent) {
    // Method to be implemented by subclasses
  }

  cancel(e: ToolEvent) {
    // Method to be implemented by subclasses
  }

  reset(e: ToolEvent | ToolPointerEvent) {
    this.currentEvent = null;
    this.options.lastPosition = ipoint(0, 0);
    e.ctx.clearRect(0, 0, e.ctx.canvas.width, e.ctx.canvas.height);
  }

  /**
   * Send an action to the main worker to use the tool.
   * @param dimension The dimension of the display in pixels.
   * @param normalizedPosition The position in the display normalized to [0, 1].
   * @param options Additional options for the action.
   */
  override action<Result extends IActionResult = ClientIncomingAction>(
    options: Partial<TOptions> = {},
    {
      event: { dimension, normalizedPosition, seed }
    }: {
      event: ToolPointerEvent;
    }
  ) {
    const toolOptions: TOptions = {
      ...this.options,
      ...options
    };

    const workerManager = this.app.workerManager;
    const display = this.getDisplay();
    return workerManager.action<MainWorkerIncomingAction, Result>({
      type: WORKER_ACTION_TYPE.USE_TOOL,
      payload: {
        tool: this.type,
        toolOptions,
        meta: {
          dimension,
          displayPosition: display.options.position,
          position: normalizedPosition,
          zoomLevel: display.options.zoomLevel,
          seed
        }
      }
    });
  }
}
