import domEvents from '@web-workbench/core/services/domEvents';
import Tool from './Tool';
import type ExtendedPointerEvent from '../ExtendedPointerEvent';
import { ipoint } from '@js-basics/vector';

export default class Zoom extends Tool {
  override onPointerDown(e: ExtendedPointerEvent) {
    const display = this.app.display;
    if (!display) {
      throw new Error('Display not found');
    }
    let value = 2;
    if (display.maxZoomFactor - 5 < display.zoomFactor) {
      value = 1;
    }
    value = domEvents.altActive ? -value : value;
    display.zoom(value, ipoint(e.x, e.y));
    return {
      events: false
    };
  }
}
