import type { LoadImagePayload } from '../types/worker.payload';
import { WORKER_ACTION_TYPE } from '../types/worker';
import type { ActionCommandToMainWorker } from '../types/worker.message.main';
import Color from './classes/Color';
import WorkerManager from './classes/WorkerManager';
import type { BrushSelect, ColorSelect, ToolSelect } from '../types/select';
import Display from './classes/Display';
import type { Document } from './classes/Document';
import { getBlankDocument } from './utils/document';
import type { DisplayWorkerIncomingAction } from '../types/worker.message.display';
import {
  getDefaultBrushSelect,
  getDefaultColorSelect,
  getDefaultToolSelect
} from './utils/select';

import AppActions from './AppActions';
import type Config from '@web-workbench/core/classes/Config';
import type Palette from './classes/Palette';
import type { Colors, PixelGrid } from '../types/display';

export interface AppState {
  stackMaxSize: number;
  stackCount: number;
  stackIndex: number;
}

export class AppOptions {
  select: {
    brush: BrushSelect;
    tool?: ToolSelect;
    color: ColorSelect;
  };
  display: {
    colors: Colors;
    grid: PixelGrid;
  };
  zoomStep: number;
  constructor(options?: Partial<AppOptions>) {
    const { select, display, zoomStep } = options || {};
    this.select = select || {
      brush: getDefaultBrushSelect(),
      tool: getDefaultToolSelect(),
      color: getDefaultColorSelect()
    };
    this.display = display || {
      colors: {
        background: new Color(255, 255, 255),
        foreground: new Color(0, 0, 0)
      },
      grid: {
        color: new Color(0, 0, 0, 0.2),
        lineWidth: 1,
        visibleCount: 10
      }
    };
    this.zoomStep = zoomStep || 0.2;
  }
}

export class App {
  actions: AppActions = new AppActions(this);
  state: AppState = {
    stackCount: 0,
    stackIndex: -1,
    stackMaxSize: 0
  };
  workerManager: WorkerManager;
  currentDocument?: Document;
  currentDisplay?: Display;
  canvas?: HTMLCanvasElement;
  options: AppOptions;
  displays: Display[] = [];

  constructor({ options }: { options: Partial<AppOptions> }, config: Config) {
    this.options = new AppOptions(options);
    this.workerManager = new WorkerManager(this, config);

    this.setDisplay(this.addDisplay());
  }

  async setup() {
    // const canvas = document.createElement('canvas');
    await this.workerManager.setup();
    this.setDocument(getBlankDocument());
  }

  closeDocument() {
    this.currentDocument = undefined;
  }

  addDisplay(options?: Partial<Display>) {
    const display = new Display(this, {
      colors: this.options.display.colors,
      pixelGrid: this.options.display.grid,
      ...(options || {})
    });
    this.displays.push(display);
    return display;
  }

  setDisplays(count: number) {
    if (count < 1 || count > 4) {
      throw new Error('Display count must be between 1 and 4');
    }
    const need = count - this.displays.length;

    for (let i = 0; i < Math.abs(need); i++) {
      if (need < 0) {
        this.removeDisplay(this.displays[this.displays.length - 1]);
      } else {
        this.addDisplay();
      }
    }
  }

  setDisplayColors(colors: Colors) {
    this.displays.forEach(display => {
      display.setColors(colors);
    });
  }

  setDisplayPixelGrid(pixelGrid: PixelGrid) {
    this.displays.forEach(display => {
      display.setPixelGrid(pixelGrid);
    });
  }

  get hasMaxDisplays() {
    return this.displays.length >= 4;
  }

  async setDisplayCanvas(display: Display, canvas: HTMLCanvasElement) {
    await this.workerManager.addDisplay(display, canvas);
  }
  removeDisplayCanvas(display: Display) {
    this.workerManager.removeDisplay(display);
  }

  removeDisplay(display: Display) {
    this.workerManager.removeDisplay(display);
    this.displays = this.displays.filter(d => d !== display);
  }

  removeDisplays() {
    return Promise.all(
      this.displays.map(display => {
        return this.workerManager.removeDisplay(display);
      })
    );
  }

  async setDocument(doc: Document) {
    if (this.currentDocument) {
      this.currentDocument.destroy();
    }
    const imageBitmap = doc.data;

    this.currentDocument = doc;

    const drawCommand: ActionCommandToMainWorker<LoadImagePayload> = {
      type: WORKER_ACTION_TYPE.LOAD_IMAGE,
      payload: {
        imageBitmap
      }
    };
    await this.workerManager.action(drawCommand, [imageBitmap]);
  }

  setDisplay(display?: string | Display) {
    if (typeof display === 'string') {
      display = this.displays.find(d => d.id === display);
    }
    this.currentDisplay = display;
  }

  actionDisplay(
    display: Display,
    action: DisplayWorkerIncomingAction,
    transfer?: Transferable[]
  ) {
    return this.workerManager.action<DisplayWorkerIncomingAction>(
      action,
      transfer,
      display.worker
    );
  }

  // #region getters

  get ready() {
    return Promise.all([this.workerManager.ready]);
  }

  // #endregion

  // #region setters

  setState(state: Partial<AppState>) {
    this.state = {
      ...this.state,
      ...state
    };
  }

  setBrush(value: BrushSelect) {
    this.options.select.brush = value;
  }

  setSelectOptions(
    name: keyof AppOptions['select'],
    value: ToolSelect | BrushSelect | ColorSelect | undefined,
    merge = false
  ) {
    let v;
    if (merge) {
      v = {
        ...this.options.select[name],
        ...value
      };
    }
    this.options.select = {
      ...this.options.select,
      [name]: v || value
    };
    this.actions.setSelectOptions(this.options.select);
  }
  setColor(value: ColorSelect) {
    this.options.select.color = value;
  }

  setColorPalette(palette: Palette) {
    this.options.select.color.palette = palette;
  }

  // #endregion

  async getImageData() {
    const { payload } = await this.actions.getData();
    const { buffer, dimension } = payload!;

    const view = new Uint8ClampedArray(buffer.length);
    view.set(buffer);
    return new ImageData(view, dimension.x, dimension.y);
  }
}
