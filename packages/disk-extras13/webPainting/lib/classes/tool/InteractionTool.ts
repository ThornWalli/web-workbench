/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  type IAction,
  WORKER_ACTION_TYPE,
  type ActionSuccess,
  type IActionResult
} from './../../../types/worker';
import type { ToolSelect } from '@web-workbench/disk-extras13/webPainting/types/select';
import Tool, {
  type ActionContext,
  type ToolConstructorOptions,
  type ToolEvent,
  type ToolPointerEvent,
  type ToolUseOptions
} from '../Tool';

import type { ColorPickerSuccessPayload } from '@web-workbench/disk-extras13/webPainting/types/worker.payload';
import {} from '@web-workbench/disk-extras13/webPainting/types/worker';
import type { MainWorkerIncomingAction } from '@web-workbench/disk-extras13/webPainting/types/worker.message.main';
import type { ClientIncomingAction } from '@web-workbench/disk-extras13/webPainting/types/worker.message.client';

export interface InteractionActionContext extends ActionContext {
  event: ToolPointerEvent;
}

export default class InteractionTool<
  TOptions extends ToolUseOptions = ToolUseOptions
> extends Tool<TOptions, InteractionActionContext> {
  interactingMove = false;
  constructor({
    domEvents,
    interactingMove,
    ...options
  }: {
    interactingMove?: boolean;
  } & ToolConstructorOptions<TOptions>) {
    super({
      ...options
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
    // Method to be implemented by subclasses
  }
  async pointerUp(e: ToolPointerEvent) {
    // Method to be implemented by subclasses
  }

  pointerMove(e: ToolPointerEvent) {
    // Method to be implemented by subclasses
  }
  contextMenu(e: ToolPointerEvent) {
    // Method to be implemented by subclasses
  }
  pointerCancel(e: ToolEvent) {
    // Method to be implemented by subclasses
  }

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
  override action<Result extends IActionResult = ClientIncomingAction>(
    options: Partial<TOptions> = {},
    {
      event: { dimension, normalizedPosition }
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
          zoomLevel: display.currentZoomLevel
        }
      }
    });
  }
}
