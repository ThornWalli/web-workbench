import Vector from '../Vector';
import Tool from './Tool';
import domEvents from '@/web-workbench/services/domEvents';

export default class Zoom extends Tool {
  onPointerDown (event) {
    const value = domEvents.altActive ? -2 : 2;
    this.app.display.zoom(value, new Vector(event.x, event.y));
    return {
      events: false
    };
  }
}
