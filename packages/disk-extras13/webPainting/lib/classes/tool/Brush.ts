import { WORKER_ACTION_TYPE } from '../../../types/worker';
import Tool, {
  type ToolConstructorOptions,
  type ToolPointerEvent,
  type ToolUseOptions
} from '../Tool';
import type { UseToolPayload } from '../../../types/worker.payload';

export default class Brush<
  TOptions extends ToolUseOptions = ToolUseOptions
> extends Tool<TOptions> {
  constructor(options: ToolConstructorOptions<TOptions>) {
    super({
      ...options,
      options: {
        ...options.options,
        stackable: true
      }
    });
  }

  override pointerMove({
    dimension,
    normalizedPosition
  }: ToolPointerEvent): void {
    const workerManager = this.app.workerManager;
    const display = this.getDisplay();
    workerManager.action<{
      type: WORKER_ACTION_TYPE.USE_TOOL;
      payload: UseToolPayload;
    }>({
      type: WORKER_ACTION_TYPE.USE_TOOL,
      payload: {
        tool: this.type,
        toolOptions: this.options,
        meta: {
          dimension,
          displayPosition: display.options.position,
          position: normalizedPosition,
          zoomLevel: display.currentZoomLevel,
          density: display.options.density
        }
      }
    });
  }

  override async pointerDown(e: ToolPointerEvent): Promise<void> {
    await super.pointerDown(e);
    const { dimension, normalizedPosition } = e;
    const workerManager = this.app.workerManager;

    const display = this.getDisplay();
    workerManager.action<{
      type: WORKER_ACTION_TYPE.USE_TOOL;
      payload: UseToolPayload;
    }>({
      type: WORKER_ACTION_TYPE.USE_TOOL,
      payload: {
        tool: this.type,
        toolOptions: this.options,
        meta: {
          dimension,
          displayPosition: display.options.position,
          position: normalizedPosition,
          zoomLevel: display.currentZoomLevel,
          density: display.options.density
        }
      }
    });
  }
  override async pointerUp(e: ToolPointerEvent): Promise<void> {
    return super.pointerUp(e);
  }
}
