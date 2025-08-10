import type { ClientIncomingAction } from '../../types/worker.message.client';
import Color from '@web-workbench/core/classes/Color';
import type { App } from '../App';
import type { DisplayWorkerIncomingAction } from '../../types/worker.message.display';
import DisplayActions from './DisplayActions';
import type { IActionResult } from '../../types/worker';
import DisplayOptions from './DisplayOptions';
import type { Colors, Grid, PixelGrid } from '../../types/display';

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
      foreground: new Color(colors.foreground)
    };
    return this.actions.setOptions();
  }

  setPixelGrid(pixelGrid: PixelGrid) {
    this.options.pixelGrid = {
      ...pixelGrid,
      color: new Color(pixelGrid.color)
    };
    return this.actions.setOptions();
  }

  setGrid(grid: Grid) {
    this.options.grid = { ...grid };
    return this.actions.setOptions();
  }
}
