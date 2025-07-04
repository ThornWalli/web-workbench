import type { UseToolPayload } from '@web-workbench/disk-web-paint/webPaint/types/worker.payload';

import Tool from '../Tool';
import type { ToolConstructorOptions, ToolUseOptions } from '../Tool';
import { WORKER_ACTION_TYPE } from '@web-workbench/disk-web-paint/webPaint/types/worker';
import type { ActionCommandToMainWorker } from '@web-workbench/disk-web-paint/webPaint/types/worker.message.main';

export default class AbstractTool<
  TOptions extends ToolUseOptions = ToolUseOptions
> extends Tool<TOptions> {
  constructor(options: ToolConstructorOptions<TOptions>) {
    super({
      ...options,
      options: {
        ...options.options,
        abstract: true
      }
    });
  }

  /**
   * Wird verwendet wenn 'abstract' aktiv ist.
   * Wird verwendet wenn Tool unabhängig verwendet wird, z.B. in einem Kontextmenü.
   */
  async execute(options: TOptions): Promise<void> {
    if (this.options.stackable) {
      await this.app.actions.startStack();
    }

    await this.app.workerManager.action<{
      type: WORKER_ACTION_TYPE.USE_TOOL;
      payload: UseToolPayload<TOptions>;
    }>({
      type: WORKER_ACTION_TYPE.USE_TOOL,
      payload: {
        tool: this.type,
        toolOptions: { ...this.options, ...options }
      }
    });

    if (this.options.stackable) {
      await this.app.actions.stopStack();
    }
  }

  /**
   * Send an action to the main worker to use the tool.
   * @param dimension The dimension of the display in pixels.
   * @param normalizedPosition The position in the display normalized to [0, 1].
   * @param options Additional options for the action.
   */
  override action(options: Partial<TOptions> = {}) {
    const toolOptions: TOptions = {
      ...this.options,
      ...options
    };

    const workerManager = this.app.workerManager;
    workerManager.action<
      ActionCommandToMainWorker<
        UseToolPayload<TOptions>,
        WORKER_ACTION_TYPE.USE_TOOL
      >
    >({
      type: WORKER_ACTION_TYPE.USE_TOOL,
      payload: {
        tool: this.type,
        toolOptions
      }
    });
  }
}
