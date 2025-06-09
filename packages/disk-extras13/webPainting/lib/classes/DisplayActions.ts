import { ipoint, type IPoint } from '@js-basics/vector';
import type Display from './Display';
import { WORKER_ACTION_TYPE } from '../../types/worker';
import { TOOLS, type ToolSelect } from '../../types/select';
import type { DomEvents } from '@web-workbench/core/services/domEvents';

export default class DisplayActions {
  constructor(private display: Display) {}

  useTool(position: IPoint & number, { domEvents }: { domEvents: DomEvents }) {
    const tool: ToolSelect = this.display.app.options.select.tool!;
    switch (tool.value) {
      case TOOLS.ZOOM: {
        const zoomStep = this.display.app.options.zoomStep;
        const zoomLevel =
          1 + (domEvents.shiftLeftActive ? -zoomStep : zoomStep);
        this.setZoom(position, zoomLevel);
      }
    }
  }

  setPosition(position: IPoint & number) {
    this.display.options.position = position;
    return this.display.action({
      type: WORKER_ACTION_TYPE.SET_POSITION,
      payload: {
        position: position
      }
    });
  }
  setZoom(position: IPoint & number = ipoint(0, 0), zoomLevel: number) {
    this.display.options.zoomLevel = zoomLevel;
    return this.display.action({
      type: WORKER_ACTION_TYPE.SET_ZOOM,
      payload: {
        zoomLevel: zoomLevel,
        position
      }
    });
  }
}
