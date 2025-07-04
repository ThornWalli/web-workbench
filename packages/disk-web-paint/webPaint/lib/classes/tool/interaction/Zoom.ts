import { TOOLS } from '@web-workbench/disk-web-paint/webPaint/types/select';
import type { ToolConstructorOptions, ToolPointerEvent } from '../../Tool';
import { WORKER_ACTION_TYPE } from '@web-workbench/disk-web-paint/webPaint/types/worker';
import InteractionTool from '../InteractionTool';

export default class Zoom extends InteractionTool {
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
      1 + (this.domEvents?.shiftLeftActive ? -zoomStep : zoomStep);
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
