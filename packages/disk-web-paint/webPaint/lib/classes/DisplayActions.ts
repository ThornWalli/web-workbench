import { ipoint } from '@js-basics/vector';
import type { IPoint } from '@js-basics/vector';
import type Display from './Display';
import { WORKER_ACTION_TYPE } from '../../types/worker';
import type { ActionSuccess } from '../../types/worker';
import { TOOL } from '../../types/select';
import type { ToolSelect } from '../../types/select';
import type { DomEvents } from '@web-workbench/core/services/domEvents';
import type { ColorPickerSuccessPayload } from '../../types/worker.payload';

export default class DisplayActions {
  constructor(private display: Display) {}

  useTool(position: IPoint & number, { domEvents }: { domEvents: DomEvents }) {
    const tool: ToolSelect = this.display.app.options.select.tool!;
    switch (tool.value) {
      case TOOL.ZOOM: {
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
  setZoom(
    position: IPoint & number = ipoint(0, 0),
    zoomLevel: number,
    replace: boolean = false
  ) {
    this.display.options.zoomLevel = zoomLevel;
    return this.display.action({
      type: WORKER_ACTION_TYPE.SET_ZOOM,
      payload: {
        zoomLevel: zoomLevel,
        position,
        replace
      }
    });
  }

  colorPicker(position: IPoint & number) {
    return this.display.action<
      ActionSuccess<
        ColorPickerSuccessPayload,
        WORKER_ACTION_TYPE.COLOR_PICKER_SUCCESS
      >
    >({
      type: WORKER_ACTION_TYPE.COLOR_PICKER,
      payload: {
        position
      }
    });
  }

  async fitZoom() {
    const display = this.display;
    await display.actions.setPosition(ipoint(0, 0));
    await display.actions.setZoom(ipoint(0, 0), 0);
    await display.action({
      type: WORKER_ACTION_TYPE.ZOOM_FIT,
      payload: {}
    });
  }

  async setOptions() {
    const display = this.display;
    await display.action({
      type: WORKER_ACTION_TYPE.SET_OPTIONS,
      payload: {
        options: display.options
      }
    });
  }
}
