import { TOOLS } from '@web-workbench/disk-extras13/webPainting/types/select';
import type { ToolConstructorOptions } from '../../Tool';
import { WORKER_ACTION_TYPE } from '@web-workbench/disk-extras13/webPainting/types/worker';
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
      await display.actions.setPosition(ipoint(0, 0));
      await display.actions.setZoom(ipoint(0, 0), 0);
      await display.action({
        type: WORKER_ACTION_TYPE.ZOOM_FIT,
        payload: {}
      });
    }
  }
}
