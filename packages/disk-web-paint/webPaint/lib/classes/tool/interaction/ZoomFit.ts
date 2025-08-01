import { TOOL } from '../../../../types/select';
import type { ToolConstructorOptions } from '../../Tool';
import { WORKER_ACTION_TYPE } from '../../../../types/worker';
import InteractionTool from '../InteractionTool';
import type { InteractionOptions } from '../InteractionTool';
import { ipoint } from '@js-basics/vector';

export default class FitZoom extends InteractionTool {
  constructor(
    options: Omit<ToolConstructorOptions<InteractionOptions>, 'type'>
  ) {
    super({
      ...options,
      type: TOOL.ZOOM,
      options: {
        ...options.options,
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
