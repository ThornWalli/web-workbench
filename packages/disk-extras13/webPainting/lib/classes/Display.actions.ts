import { ipoint, type IPoint } from '@js-basics/vector';
import type Display from './Display';
import { WORKER_ACTION_TYPE } from '../../types/worker';

export default class DisplayActions {
  constructor(private display: Display) {}

  setPosition(position: IPoint & number) {
    this.display.options.position = position;
    return this.display.action({
      type: WORKER_ACTION_TYPE.SET_POSITION,
      payload: {
        position: position.toJSON()
      }
    });
  }

  setZoom(position: IPoint = ipoint(0, 0), zoomLevel: number) {
    this.display.options.zoomLevel = zoomLevel;
    return this.display.action({
      type: WORKER_ACTION_TYPE.SET_ZOOM,
      payload: {
        zoomLevel: zoomLevel,
        position: position.toJSON()
      }
    });
  }
}
