import { ipoint, type IPoint } from '@js-basics/vector';
import { Color } from './Color';

export enum DISPLAY_ORIGIN {
  TOP_LEFT = 'top_left',
  TOP_CENTER = 'top_center',
  TOP_RIGHT = 'top_right',
  CENTER_LEFT = 'center_left',
  CENTER = 'center',
  CENTER_RIGHT = 'center_right',
  BOTTOM_LEFT = 'bottom_left',
  BOTTOM_CENTER = 'bottom_center',
  BOTTOM_RIGHT = 'bottom_right'
}

export const DISPLAY_ORIGIN_VALUE = {
  [DISPLAY_ORIGIN.TOP_LEFT]: ipoint(-1, -1),
  [DISPLAY_ORIGIN.TOP_CENTER]: ipoint(0, -1),
  [DISPLAY_ORIGIN.TOP_RIGHT]: ipoint(1, -1),
  [DISPLAY_ORIGIN.CENTER_LEFT]: ipoint(-1, 0),
  [DISPLAY_ORIGIN.CENTER]: ipoint(0, 0),
  [DISPLAY_ORIGIN.CENTER_RIGHT]: ipoint(1, 0),
  [DISPLAY_ORIGIN.BOTTOM_LEFT]: ipoint(-1, 1),
  [DISPLAY_ORIGIN.BOTTOM_CENTER]: ipoint(0, 1),
  [DISPLAY_ORIGIN.BOTTOM_RIGHT]: ipoint(1, 1)
};

export interface DisplayOptions {
  origin: DISPLAY_ORIGIN;
  offset: IPoint & number;
  background: Color;
  foreground: Color;
}
export default class Display {
  worker?: Worker;
  options: DisplayOptions;
  constructor(options: Partial<DisplayOptions> = {}) {
    this.options = {
      origin: options.origin || DISPLAY_ORIGIN.CENTER,
      offset: options.offset || ipoint(0, 0),
      background: options.background || new Color(255, 255, 255),
      foreground: options.foreground || new Color(0, 0, 0)
    };
  }
  setWorker(worker: Worker) {
    this.worker = worker;
  }
}
