import type { LoadImagePayload } from './../types/worker.payload';
import { WORKER_ACTION_TYPE } from '../types/worker';
import type { ActionCommandToMainWorker } from '../types/worker.message.main';
import { Color } from './classes/Color';
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

class AppOptions {
  density: number;
  select: {
    brush: BrushSelect;
    tool: ToolSelect;
    color: ColorSelect;
  };
  display: {
    background: Color;
    foreground: Color;
  };
  zoomStep: number;
  constructor(options?: Partial<AppOptions>) {
    const { density, select, display, zoomStep } = options || {};
    this.density = density || 1;
    this.select = select || {
      brush: getDefaultBrushSelect(),
      tool: getDefaultToolSelect(),
      color: getDefaultColorSelect()
    };
    this.display = display || {
      background: new Color(255, 255, 255),
      foreground: new Color(0, 0, 0)
    };
    this.zoomStep = zoomStep || 0.2;
  }
}

export class App {
  workerManager: WorkerManager;
  currentDocument?: Document;
  currentDisplay?: Display;
  canvas?: HTMLCanvasElement;
  options: AppOptions;
  displays: Display[] = [];

  constructor({ options }: { options: Partial<AppOptions> }) {
    this.options = new AppOptions(options);
    this.workerManager = new WorkerManager();

    this.addDisplay();
  }

  async setup() {
    const canvas = document.createElement('canvas');
    await this.workerManager.setCanvas(canvas);
    this.setDocument(getBlankDocument());
  }

  closeDocument() {
    this.currentDocument = undefined;
  }

  addDisplay(options?: Partial<Display>) {
    this.displays.push(
      new Display(this, {
        background: this.options.display.background,
        foreground: this.options.display.foreground,
        ...(options || {})
      })
    );
  }
  get hasMaxDisplays() {
    return this.displays.length >= 4;
  }

  setDisplayCanvas(display: Display, canvas: HTMLCanvasElement) {
    this.workerManager.addDisplay(display, canvas);
  }
  removeDisplayCanvas(display: Display) {
    this.workerManager.removeDisplay(display);
  }

  removeDisplay(display: Display) {
    this.workerManager.removeDisplay(display);
    this.displays = this.displays.filter(d => d !== display);
  }

  async setDocument(doc: Document) {
    const imageBitmap = doc.data;

    this.currentDocument = doc;

    const drawCommand: ActionCommandToMainWorker<LoadImagePayload> = {
      type: WORKER_ACTION_TYPE.LOAD_IMAGE,
      payload: {
        imageBitmap
      }
    };
    this.workerManager.action(drawCommand, [imageBitmap]);
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

  get ready() {
    return Promise.all([this.workerManager.ready]);
  }

  // #region setters

  setBrush(value: BrushSelect) {
    this.options.select.brush = value;
  }
  setTool(value: ToolSelect) {
    this.options.select.tool = value;
  }
  setColor(value: ColorSelect) {
    this.options.select.color = value;
  }

  // #endregion
}
