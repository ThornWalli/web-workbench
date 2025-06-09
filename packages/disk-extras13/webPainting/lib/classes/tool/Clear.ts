import type { UseToolPayload } from '@web-workbench/disk-extras13/webPainting/types/worker.payload';
import { TOOLS, type ToolSelect } from '../../../types/select';
import Tool, {
  startStack,
  stopStack,
  type ToolConstructorOptions
} from '../Tool';
import { WORKER_ACTION_TYPE } from '@web-workbench/disk-extras13/webPainting/types/worker';

export default class Clear extends Tool {
  constructor(options: Omit<ToolConstructorOptions, 'type' | 'options'>) {
    super({
      ...options,
      type: TOOLS.CLEAR,
      options: {
        stackable: true,
        passive: true
      }
    });
  }

  override async onClick(e: MouseEvent, value: ToolSelect): Promise<void> {
    super.onClick(e, value);

    await startStack(this.app.workerManager);

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

    await stopStack(this.app.workerManager);
  }
}
