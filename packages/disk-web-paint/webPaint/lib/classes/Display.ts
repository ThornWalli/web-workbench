import type { ClientIncomingAction } from '../../types/worker.message.client';
import { ipoint } from '@js-basics/vector';
import type { IPoint } from '@js-basics/vector';
import Color from './Color';
import type { App } from '../App';
import type { DisplayWorkerIncomingAction } from '../../types/worker.message.display';
import DisplayActions from './DisplayActions';
import type { IActionResult } from '../../types/worker';

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
  colors: {
    background: Color;
    foreground: Color;
    grid: Color;
  };
  zoomLevel: number;

  precision: number;

  constructor(
    options?: Partial<DisplayOptions | ReturnType<DisplayOptions['toJSON']>>
  ) {
    const { origin, position, colors, zoomLevel } = options || {};
    this.origin = origin || DISPLAY_ORIGIN.CENTER;
    this.position = position ? ipoint(position.x, position.y) : ipoint(0, 0);
    this.colors = {
      background: colors?.background
        ? new Color(colors.background)
        : new Color(0, 0, 0),
      foreground: colors?.foreground
        ? new Color(colors.foreground)
        : new Color(255, 255, 255),
      grid: colors?.grid ? new Color(colors.grid) : new Color(0, 0, 0, 0.2)
    };
    this.zoomLevel = zoomLevel || 1;
    this.precision = 3;
  }

  toJSON() {
    return {
      _type: this.constructor.name,
      origin: this.origin,
      position: this.position.toJSON(),
      colors: {
        background: this.colors.background.toJSON(),
        foreground: this.colors.foreground.toJSON(),
        grid: this.colors.grid.toJSON()
      },
      zoomLevel: this.zoomLevel,
      precision: this.precision
    };
  }
}

export interface TransferableOptions {
  origin: DISPLAY_ORIGIN;
  position: { x: number; y: number };
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

  /**
   * @deprecated
   * Use `DisplayOptions.zoomLevel` instead.
   */
  currentZoomLevel: number = 1;

  constructor(app: App, options: Partial<DisplayOptions> = {}) {
    this.app = app;
    this.options = new DisplayOptions(options);
    this.actions = new DisplayActions(this);
  }
  setWorker(worker: Worker) {
    this.worker = worker;
  }

  setCurrentZoomLevel(zoomLevel: number) {
    this.options.zoomLevel = zoomLevel;
  }

  action<Result extends IActionResult = ClientIncomingAction>(
    action: DisplayWorkerIncomingAction,
    transfer?: Transferable[]
  ) {
    return this.app.workerManager.action<DisplayWorkerIncomingAction, Result>(
      action,
      transfer,
      this.worker
    );
  }

  setColors(colors: Colors) {
    this.options.colors = {
      background: new Color(colors.background),
      foreground: new Color(colors.foreground),
      grid: new Color(colors.grid)
    };
    this.actions.setOptions();
  }
}

export interface Colors {
  background: Color;
  foreground: Color;
  grid: Color;
}
