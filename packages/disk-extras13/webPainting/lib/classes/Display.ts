import { ipoint, type IPoint } from '@js-basics/vector';
import { Color } from './Color';
import type { App } from '../App';
import type { DisplayWorkerIncomingAction } from '../../types/worker.message.display';
import DisplayActions from './DisplayActions';

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

export class DisplayOptions {
  origin: DISPLAY_ORIGIN;
  /**
   * Normalized position in the display. 0.1 is 10% of the display width/height.
   */
  position: IPoint & number;
  background: Color;
  foreground: Color;
  zoomLevel: number;

  density: number;
  precision: number;

  constructor(options?: Partial<DisplayOptions>) {
    const { origin, position, background, foreground, zoomLevel } =
      options || {};
    this.origin = origin || DISPLAY_ORIGIN.CENTER;
    this.position = position || ipoint(0, 0);
    this.background = background || new Color(255, 255, 255);
    this.foreground = foreground || new Color(0, 0, 0);
    this.zoomLevel = zoomLevel || 16;
    this.density = 1;
    this.precision = 2;
  }

  toJSON(): TransferableOptions {
    return {
      origin: this.origin,
      offset: this.position.toJSON(),
      background: this.background.toHex(),
      foreground: this.foreground.toHex(),
      density: this.density,
      precision: this.precision
    };
  }

  static fromJSON(json: TransferableOptions) {
    return new DisplayOptions({
      origin: json.origin,
      position: ipoint(json.offset.x, json.offset.y),
      background: Color.fromHex(json.background),
      foreground: Color.fromHex(json.foreground)
    });
  }
}

export interface TransferableOptions {
  origin: DISPLAY_ORIGIN;
  offset: { x: number; y: number };
  background: string;
  foreground: string;
  density: number;
  precision: number;
}

export default class Display {
  id: string = crypto.randomUUID();
  actions: DisplayActions;
  app: App;
  worker?: Worker;
  options: DisplayOptions;

  constructor(app: App, options: Partial<DisplayOptions> = {}) {
    this.app = app;
    this.options = new DisplayOptions(options);
    this.actions = new DisplayActions(this);
  }
  setWorker(worker: Worker) {
    this.worker = worker;
  }

  action(action: DisplayWorkerIncomingAction, transfer?: Transferable[]) {
    return this.app.workerManager.action<DisplayWorkerIncomingAction>(
      action,
      transfer,
      this.worker
    );
  }
}
