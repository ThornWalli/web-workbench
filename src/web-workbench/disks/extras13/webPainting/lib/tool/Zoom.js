import domEvents from '@/web-workbench/services/domEvents';
import Vector from '../Vector';
import Tool from './Tool';

export default class Zoom extends Tool {
  onPointerDown (event) {
    const display = this.app.display;
    let value = 2;
    if (display.maxZoomFactor - 5 < display.zoomFactor) {
      value = 1;
    }
    value = domEvents.altActive ? -value : value;
    this.app.display.zoom(value, new Vector(event.x, event.y));
    return {
      events: false
    };
  }
}
