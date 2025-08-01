import { TOOL } from '../../../../types/select';
import type { ToolConstructorOptions } from '../../Tool';
import { WORKER_ACTION_TYPE } from '../../../../types/worker';
import InteractionTool from '../InteractionTool';
import type { InteractionOptions } from '../InteractionTool';
import type ToolPointerEvent from '../../ToolPointerEvent';

export default class Zoom extends InteractionTool {
  constructor(
    options: Omit<ToolConstructorOptions<InteractionOptions>, 'type'>
  ) {
    super({
      ...options,
      type: TOOL.ZOOM
    });
  }
  override async pointerUp(e: ToolPointerEvent) {
    const display = this.getDisplay();
    const zoomStep = this.app.options.zoomStep;
    const zoomLevel =
      1 + (this.domEvents?.shiftLeftActive ? -zoomStep : zoomStep);
    display.options.zoomLevel = zoomLevel;
    await display.action({
      type: WORKER_ACTION_TYPE.SET_ZOOM,
      payload: {
        zoomLevel: zoomLevel,
        position: e.normalizedPosition
      }
    });
  }
}
