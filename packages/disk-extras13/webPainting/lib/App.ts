import type { LoadImagePayload } from './../types/worker.payload';
import { WORKER_ACTION_TYPE } from '../types/worker';
import type { ActionCommandToMainWorker } from '../types/worker.message.main';
import type { Color } from './classes/Color';
import WorkerManager from './classes/WorkerManager';
import type { BrushSelect, ColorSelect, ToolSelect } from '../types/select';
import Display from './classes/Display';
import type { Document } from './classes/Document';
import { getBlankDocument } from './utils/document';

interface AppOptions {
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
}

export class App {
  workerManager: WorkerManager;
  currentDocument?: Document;
  canvas?: HTMLCanvasElement;
  options: AppOptions;
  displays: Display[] = [];

  constructor({ options }: { options: AppOptions }) {
    this.options = options;
    this.workerManager = new WorkerManager();

    this.addDisplay();
    this.setDocument(getBlankDocument());
  }

  closeDocument() {
    this.currentDocument = undefined;
  }

  addDisplay(options?: Partial<Display>) {
    this.displays.push(
      new Display({
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
    const canvas = document.createElement('canvas');

    const imageBitmap = doc.data;
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;

    await this.workerManager.setCanvas(canvas);
    this.currentDocument = doc;

    const drawCommand: ActionCommandToMainWorker<LoadImagePayload> = {
      type: WORKER_ACTION_TYPE.LOAD_IMAGE,
      payload: {
        imageBitmap
      }
    };
    this.workerManager.action(drawCommand, [imageBitmap]);
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
