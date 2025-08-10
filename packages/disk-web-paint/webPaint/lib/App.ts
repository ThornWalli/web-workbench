import type { LoadDocumentPayload } from '../types/worker.payload';
import { WORKER_ACTION_TYPE } from '../types/worker';
import type { ActionCommandToMainWorker } from '../types/worker.message.main';
import Color from '@web-workbench/core/classes/Color';
import WorkerManager from './classes/WorkerManager';
import type { BrushSelect, ColorSelect, ToolSelect } from '../types/select';
import Display from './classes/Display';
import { Document } from './classes/Document';
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
import type InteractionTool from './classes/tool/InteractionTool';
import type { LayerDescription } from '../types/layer';
import { from, lastValueFrom, of, ReplaySubject } from 'rxjs';
import {
  deserializeWithTransforms,
  serializeWithTransforms
} from '../operators';
import {
  blobFromImageData,
  blobToImageBitmap
} from '@web-workbench/core/utils/blob';
import { imageDataFromUint8Array } from '@web-workbench/core/utils/imageData';
import { CONFIG_NAMES } from '../types';
import { DEFAULT_TEMPLATE } from '../utils/formats';
import { ipoint } from '@js-basics/vector';
export interface AppState {
  stackMaxSize: number;
  stackCount: number;
  stackIndex: number;
  layers: LayerDescription[];
  currentLayerId?: string;
}

export class AppOptions {
  select: {
    brush: BrushSelect;
    tool: ToolSelect;
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
    stackMaxSize: 0,
    layers: [],
    currentLayerId: undefined
  };
  workerManager: WorkerManager;
  config: Config;
  currentDocument?: Document;
  currentDisplay?: Display;
  canvas?: HTMLCanvasElement;
  options: AppOptions;
  displays: Display[] = [];

  state$ = new ReplaySubject<AppState>(1);

  constructor({ options }: { options: Partial<AppOptions> }, config: Config) {
    this.options = new AppOptions(options);
    this.config = config;
    this.workerManager = new WorkerManager(this, config);

    this.setDisplay(this.addDisplay());
  }

  async setup() {
    await this.workerManager.setup();
    this.setDocument(
      getBlankDocument(
        ipoint(DEFAULT_TEMPLATE.dimension.x, DEFAULT_TEMPLATE.dimension.y),
        Color.fromHex(
          this.config.get(CONFIG_NAMES.WEB_PAINT_DOCUMENT_BACKGROUND)
        )
      )
    );
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
        this.removeDisplay(this.displays[this.displays.length - 1]!);
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

    this.currentDocument = doc;

    const imageBitmaps = doc.layers.map(layer => layer.imageBitmap);
    const drawCommand: ActionCommandToMainWorker<LoadDocumentPayload> = {
      type: WORKER_ACTION_TYPE.LOAD_DOCUMENT,
      payload: {
        layers: doc.layers
      }
    };
    await this.workerManager.action(drawCommand, imageBitmaps);
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
    // console.log('setState', state);
    Object.keys(state).forEach(key => {
      this.state[key] = state[key];
    });
    this.state$.next(this.state);
  }

  setBrush(value: BrushSelect) {
    this.options.select.brush = value;
  }

  setSelectOptions(
    name: keyof AppOptions['select'],
    value: Partial<ToolSelect | BrushSelect | ColorSelect> | undefined,
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

  currentTool?: InteractionTool;
  setTool(value: InteractionTool) {
    if (this.currentTool) {
      this.currentTool.destroy();
    }
    this.currentTool = value;
  }

  // #endregion

  async getImageData() {
    const { payload } = await this.actions.getData();
    const { buffer, dimension } = payload!;

    const view = new Uint8ClampedArray(buffer.length);
    view.set(buffer);
    return new ImageData(view, dimension.x, dimension.y);
  }

  // #region Import / Export

  /**
   * Import a document from a zip file.
   */
  async importDocument(file: File) {
    const JSZip = await import('jszip').then(module => module.default);

    const zip = await JSZip.loadAsync(file);

    const documentData = await lastValueFrom(
      from(zip.file('document.json').async('text').then(JSON.parse)).pipe(
        deserializeWithTransforms()
      )
    );

    const document = new Document({
      ...documentData
    });

    await Promise.all(
      document.layers.map(async layer => {
        const blob = await zip
          .folder('layers')
          .file(layer.id + '.png')
          .async('blob');
        console.log(blob);
        layer.imageBitmap = await blobToImageBitmap(blob);
      })
    );

    return this.setDocument(document);
  }

  /**
   * Generate a zip file with the document and its layers.
   */
  async exportDocument(document: Document) {
    const { payload } = await this.actions.getLayers();

    const result: ReturnType<Document['toJSON']> = {
      ...document.toJSON()
    };

    const JSZip = await import('jszip').then(module => module.default);

    const zip = new JSZip();
    const folderLayers = zip.folder('layers');

    await Promise.all(
      payload.layers.map(async layer => {
        const blob = await blobFromImageData(
          imageDataFromUint8Array(
            layer.bufferDescription.buffer,
            layer.bufferDescription.dimension.x,
            layer.bufferDescription.dimension.y
          )
        );
        folderLayers?.file(`${layer.id}.png`, blob, {
          binary: true
        });
        // Prepare layer data
        delete layer.bufferDescription;
        result.layers.push({
          ...layer
        });
      })
    );

    const preparedResult = await lastValueFrom(
      of(result).pipe(serializeWithTransforms())
    );

    zip.file('document.json', JSON.stringify(preparedResult), {
      binary: false
    });

    return zip.generateAsync({ type: 'blob' });
  }

  // #endregion
}
