import { TOOLS } from '@web-workbench/disk-web-paint/webPaint/types/select';
import type { ToolConstructorOptions } from '../../Tool';
import { WORKER_ACTION_TYPE } from '@web-workbench/disk-web-paint/webPaint/types/worker';
import InteractionTool from '../InteractionTool';
import { ipoint } from '@js-basics/vector';

export default class FitZoom extends InteractionTool {
  constructor(options: Omit<ToolConstructorOptions, 'type' | 'options'>) {
    super({
      ...options,
      type: TOOLS.ZOOM,
      options: {
        passive: true
      }
    });
  }
  override async click() {
    const display = this.getDisplay();
    if (display) {
      await Promise.all([
        display.actions.setPosition(ipoint(0, 0)),
        display.actions.setZoom(ipoint(0, 0), 0)
      ]);
      await display.action({
        type: WORKER_ACTION_TYPE.ZOOM_FIT,
        payload: {}
      });
    }
  }
}
