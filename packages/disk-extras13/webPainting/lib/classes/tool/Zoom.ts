import { TOOLS } from '@web-workbench/disk-extras13/webPainting/types/select';
import Tool, {
  type ToolConstructorOptions,
  type ToolPointerEvent
} from '../Tool';
import { WORKER_ACTION_TYPE } from '@web-workbench/disk-extras13/webPainting/types/worker';

export default class Zoom extends Tool {
  constructor(options: Omit<ToolConstructorOptions, 'type' | 'options'>) {
    super({
      ...options,
      type: TOOLS.ZOOM,
      options: {}
    });
  }
  override async pointerUp({ normalizedPosition }: ToolPointerEvent) {
    const display = this.getDisplay();
    const zoomStep = this.app.options.zoomStep;
    const zoomLevel =
      1 + (this.domEvents.shiftLeftActive ? -zoomStep : zoomStep);
    display.options.zoomLevel = zoomLevel;
    await display.action({
      type: WORKER_ACTION_TYPE.SET_ZOOM,
      payload: {
        zoomLevel: zoomLevel,
        position: normalizedPosition
      }
    });
  }
}
