import type { UseToolPayload } from '../../../../types/worker.payload';
import { TOOL } from '../../../../types/select';
import type { ToolSelect } from '../../../../types/select';
import type { ToolConstructorOptions } from '../../Tool';
import { WORKER_ACTION_TYPE } from '../../../../types/worker';
import InteractionTool from '../InteractionTool';
import type { InteractionOptions } from '../InteractionTool';

export default class Clear extends InteractionTool {
  constructor(
    options: Omit<ToolConstructorOptions<InteractionOptions>, 'type'>
  ) {
    super({
      ...options,
      type: TOOL.CLEAR,
      options: {
        ...options.options,
        passive: true
      }
    });
  }

  override async click(e: MouseEvent, value: ToolSelect): Promise<void> {
    super.click(e, value);

    await this.app.actions.startStack();

    await this.app.workerManager.action<{
      type: WORKER_ACTION_TYPE.USE_TOOL;
      payload: UseToolPayload;
    }>({
      type: WORKER_ACTION_TYPE.USE_TOOL,
      payload: {
        tool: this.type,
        toolOptions: this.options
      }
    });

    await this.app.actions.stopStack();
  }
}
