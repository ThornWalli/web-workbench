import { BRUSH_MODE } from '../../types/select';
import type { BrushSelect, ColorSelect, ToolSelect } from '../../types/select';

import { lastValueFrom, of } from 'rxjs';
import type {
  IContext,
  SelectOptions,
  BufferDescription,
  StackItem
} from '../../types/worker/main';
import { WORKER_ACTION_TYPE } from '../../types/worker';
import type {
  ActionSuccess,
  WorkerOutgoingPostMessage
} from '../../types/worker';
import type { DisplayWorkerIncomingAction } from '../../types/worker.message.display';
import type { ManagerWorkerIncomingAction } from '../../types/worker.message.workerManager';
import { serializeWorkerPostMessage } from '../../operators';
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import {
  cloneSelectOptions,
  getDefaultBrushSelect,
  getDefaultColorSelect,
  getDefaultToolSelect
} from '../../lib/utils/select';

import { getBrushData } from '../../utils/brush';
import type {
  SyncStatePayload,
  UpdateBufferPayload,
  UseToolPayload
} from '../../types/worker.payload';
import Stacker from '../../lib/classes/Stacker';
import { executeAction } from './actions/client/useTool';
import Color from '../../lib/classes/Color';
import {
  getPixels,
  initBrush,
  setBrushSolid,
  SolidType
} from '@web-workbench/wasm';
import { toBrushMode, toColor, toDimension, toPoint } from '../../utils/wasm';
import Dots from '../../lib/classes/brush/Dots';
import Square from '../../lib/classes/brush/Square';
import LayerManager from '../../lib/classes/LayerManager';
import type { LayerDescription } from '../../types/layer';

let firstBrushSet = true; // Flag to check if the brush is set for the first time
let lastUseOptions: SelectOptions | undefined = undefined;

export class Context implements IContext {
  debug: false;
  displayWorkerPorts = [];

  // brush: undefined,
  useOptions = {
    tool: getDefaultToolSelect(),
    brush: getDefaultBrushSelect(),
    color: getDefaultColorSelect()
  };
  brushDescription;

  layerManager: LayerManager;

  actionStack;

  constructor() {
    this.layerManager = new LayerManager();
    this.actionStack = new Stacker<StackItem>({
      maxStackSize: Infinity,
      onForward: async (stacker: Stacker<StackItem>, newIndex: number) => {
        lastUseOptions = this.useOptions!;

        this.removeTmpView();
        this.setView(new Uint8Array(this.tmpSharedBuffer!.buffer));
        for (const { payload, selectOptions } of stacker
          .getStackAtIndex(newIndex)
          .flat()) {
          this.setBrush(selectOptions.brush, selectOptions.color);
          await executeAction({ ...this, useOptions: selectOptions }, payload);
        }
        this.updateClient();
        this.updateDisplays();

        if (lastUseOptions) {
          this.setSelectOptions(lastUseOptions);
        }
      },
      onBackward: async (stacker: Stacker<StackItem>, newIndex: number) => {
        lastUseOptions = this.useOptions!;

        this.removeTmpView();
        this.setView(new Uint8Array(this.tmpSharedBuffer!.buffer));
        for (const { payload, selectOptions } of stacker
          .getStackAtIndex(newIndex)
          .flat()) {
          this.setBrush(selectOptions.brush, selectOptions.color);
          await executeAction({ ...this, useOptions: selectOptions }, payload);
        }

        this.updateClient();
        this.updateDisplays();

        if (lastUseOptions) {
          this.setSelectOptions(lastUseOptions);
        }
      },
      onComplete: async () => {
        this.updateClient();
      },
      onLimitReached: actions => {
        // When the stack limit is reached, the last stack entry is added to the source shared buffer.
        if (this.tmpSharedBuffer?.buffer) {
          const buffer = this.tmpSharedBuffer?.buffer;
          const view = new Uint8Array(buffer);
          lastUseOptions = this.useOptions!;
          actions.forEach(({ payload, selectOptions }) => {
            // Execute the action to modify the shared buffer
            const { tool, meta, toolOptions } = payload;
            this.setBrush(selectOptions.brush, selectOptions.color);
            executeAction(
              {
                ...this,
                useOptions: selectOptions,
                view
              },
              {
                tool,
                meta,
                toolOptions
              }
            );
          });
          if (lastUseOptions) {
            this.setSelectOptions(lastUseOptions);
          }
        }
      }
    });
    this.layerManager.addLayer({
      name: 'Default',
      dimension: ipoint(800, 600)
    });
  }

  // #region sharedBuffer

  /**
   * @deprecated Use Layer
   */
  get sharedBuffer(): BufferDescription | undefined {
    return this.layerManager.currentLayer?.buffer;
  }
  /**
   * @deprecated Use Layer
   */
  get tmpSharedBuffer(): BufferDescription | undefined {
    return this.layerManager.currentLayer?.tmpBuffer;
  }
  /**
   * @deprecated Use Layer
   */
  get lastView(): Uint8Array<ArrayBufferLike> | undefined {
    return this.layerManager.currentLayer?.lastView;
  }
  /**
   * @deprecated Use Layer
   */
  set lastView(view: Uint8Array<ArrayBufferLike> | undefined) {
    if (this.layerManager.currentLayer) {
      this.layerManager.currentLayer.lastView = view;
    }
  }
  get tmpView(): Uint8Array<ArrayBufferLike> | undefined {
    return this.layerManager.currentLayer?.tmpView;
  }
  set tmpView(view: Uint8Array<ArrayBufferLike> | undefined) {
    if (this.layerManager.currentLayer) {
      this.layerManager.currentLayer.tmpView = view;
    }
  }
  get view(): Uint8Array<ArrayBufferLike> | undefined {
    return this.layerManager.currentLayer?.view;
  }

  // #endregion

  // #region stack

  async addActionStack(name: string, payload: UseToolPayload) {
    await this.actionStack.add({
      name,
      payload,
      selectOptions: cloneSelectOptions(this.useOptions)
    });
  }

  // #endregion

  // #region setters

  setBrush(brush: BrushSelect, brushColor: ColorSelect) {
    const BrushDataClass = getBrushData(brush!.type);
    const brushDescription = new BrushDataClass({
      size: brush.size || 1,
      primaryColor: brushColor.primaryColor.color,
      secondaryColor: brushColor.secondaryColor.color
    });

    const brushSize = brushDescription.getScaledSize(true);
    const brushMode = brush.mode || BRUSH_MODE.NORMAL;

    let solidType;
    if (brushDescription instanceof Square) {
      solidType = SolidType.Square;
    } else if (brushDescription instanceof Dots) {
      solidType = SolidType.Dots;
    } else {
      solidType = SolidType.Round;
    }

    if (firstBrushSet) {
      initBrush(
        toBrushMode(brushMode),
        solidType,
        brushSize,
        toColor(brushDescription.primaryColor),
        toColor(brushDescription.secondaryColor)
      );
      firstBrushSet = false;
    } else {
      setBrushSolid(
        toBrushMode(brushMode),
        solidType,
        brushSize,
        toColor(brushDescription.primaryColor),
        toColor(brushDescription.secondaryColor)
      );
    }

    this.brushDescription = brushDescription;
  }

  setSelectOptions({
    tool,
    brush,
    color
  }: Partial<{ tool: ToolSelect; brush: BrushSelect; color: ColorSelect }>) {
    if (brush) {
      const brushColor = color || this.useOptions.color;
      this.setBrush(brush, brushColor);
    }
    if (tool) {
      this.useOptions.tool = tool;
    }
    if (brush) {
      this.useOptions.brush = brush;
    }
    if (color) {
      this.useOptions.color = color;
    }
  }

  /**
   * @deprecated Use Layer
   */
  setSharedBuffer(buffer: SharedArrayBuffer, dimension: IPoint & number) {
    this.layerManager.currentLayer?.setSharedBuffer(buffer, dimension);
    // this.sharedBuffer = { buffer, dimension };
    // this.tmpSharedBuffer = { buffer: buffer.slice(0), dimension };
    // this.view = new Uint8Array(buffer);
    // this.lastView = this.view.slice(0);
    // this.tmpView = undefined;
  }

  getColorByPosition(position: IPoint & number) {
    const data = getPixels(
      this.view!,
      toDimension(this.getDimension()),
      toPoint(position),
      toDimension(ipoint(1, 1))
    );
    if (data.length < 4) {
      throw new Error(
        `Data length is too short: ${data.length}. Expected at least 4 bytes for RGBA.`
      );
    }
    return new Color(data[0], data[1], data[2], data[3]);
  }
  // #endregion

  // #region layer

  // addLayer(options?: {
  //   id?: string;
  //   name: string;
  //   buffer?: SharedArrayBuffer;
  //   dimension: IPoint & number;
  // }) {
  //   const defaultDimension = this.layers[0]?.dimension;
  //   const layer = new Layer({
  //     ...options,
  //     dimension: options?.dimension ?? defaultDimension
  //   });
  //   const isFirstLayer = this.layers.length === 0;
  //   this.layers.push(layer);
  //   this.layerMap.set(layer.id, layer);
  //   if (isFirstLayer) {
  //     this.currentLayerId = layer.id;
  //   }
  //   return layer;
  // }

  // removeLayer(_layerId: string): void {
  //   // empty layer check
  // }

  // selectLayer(layerId: string): void {
  //   this.currentLayerId = layerId;
  // }

  // getLayerById(layerId: string): ILayer | undefined {
  //   return this.layerMap.get(layerId);
  // }

  // setLayers(layers: ILayer[]) {
  //   // reset current layers
  //   this.layers = layers;
  //   this.layerMap.clear();
  //   this.currentLayerId = undefined;

  //   // set new layers
  //   layers.forEach(layer => {
  //     this.layerMap.set(layer.id, layer);
  //     if (!this.currentLayerId) {
  //       this.currentLayerId = layer.id;
  //     }
  //   });
  // }

  // endregion

  // #region view

  setView(view: Uint8Array) {
    if (view instanceof Uint8Array) {
      this.view?.set(view);
      this.tmpView?.set(view);
    }
  }

  createTmpView() {
    if (!this.tmpView) {
      if (this.sharedBuffer) {
        this.lastView = this.view?.slice(0);
        this.tmpView = new Uint8Array(this.sharedBuffer.buffer.slice(0));
      } else {
        throw new Error('Shared buffer is not set.');
      }
    }
    return this.tmpView;
  }

  updateTmpView() {
    if (this.view) {
      this.tmpView?.set(this.view);
    }
  }

  removeTmpView() {
    if (this.tmpView && this.view && this.lastView) {
      this.view?.set(this.lastView!);
    }
    this.tmpView = undefined;
  }
  // #endregion

  // #region getters

  getDimension() {
    if (this.sharedBuffer) {
      return ipoint(
        this.sharedBuffer.dimension.x,
        this.sharedBuffer.dimension.y
      );
    }
    throw new Error('Shared buffer is not set.');
  }

  getTargetPosition(
    position: IPoint & number,
    {
      dimension,
      displayPosition,
      zoomLevel
    }: {
      dimension: IPoint & number;
      displayPosition: number;
      zoomLevel: number;
    },
    options?: {
      round?: boolean;
    }
  ) {
    const imageDataDimension = this.getDimension();

    let targetPosition = ipoint(
      () =>
        displayPosition * imageDataDimension +
        imageDataDimension / 2 +
        ((position / zoomLevel) * dimension) / 2
    );
    targetPosition = ipoint(() =>
      Math[options?.round ? 'round' : 'floor'](targetPosition)
    );

    return targetPosition;
  }

  getTargetDimension(
    size: IPoint & number,
    {
      dimension,
      zoomLevel
    }: {
      dimension: IPoint & number;
      zoomLevel: number;
    }
  ) {
    return ipoint(() => Math.round((size / zoomLevel) * dimension));
  }

  // #endregion

  // #region methods

  getColorAtPosition(position: IPoint) {
    if (!this.view || !this.sharedBuffer) {
      throw new Error('No image data available.');
    }

    const x = Math.floor(position.x);
    const y = Math.floor(position.y);
    const index = (y * this.sharedBuffer.dimension.x + x) * 4;
    const data = this.view;

    if (data[index] !== undefined) {
      return new Color(
        data[index],
        data[index + 1],
        data[index + 2],
        data[index + 3]
      );
    }
  }

  isIntersect(position: IPoint & number): boolean {
    const imageDataDimension = this.getDimension();
    return (
      position.x >= 0 &&
      position.y >= 0 &&
      position.x <= imageDataDimension.x - 1 &&
      position.y <= imageDataDimension.y - 1
    );
  }

  // #endregion

  // ########

  // #region actions

  action(
    message: WorkerOutgoingPostMessage<ManagerWorkerIncomingAction>,
    transfer?: Transferable[]
  ) {
    return action(self as WorkerGlobal, message, transfer);
  }
  actionDisplay() {
    this.displayWorkerPorts.forEach(displayPort => {
      return (
        message: WorkerOutgoingPostMessage<DisplayWorkerIncomingAction>,
        transfer?: Transferable[]
      ) => action(displayPort, message, transfer);
    });
  }

  // #endregion

  async update(options?: { ignoreLayers?: boolean; client: boolean }) {
    const { client } = options || {};
    await this.layerManager.update(options?.ignoreLayers);

    if (client) {
      await this.updateClient();
    }
    return this.updateDisplays();
  }

  // #region display

  // layersTotalView: Uint8Array | undefined = undefined;
  setupDisplays() {
    return sendSetupMessage(this.displayWorkerPorts, this.layerManager.buffer);
  }
  async updateDisplays() {
    return sendUpdateMessage(this.displayWorkerPorts!);
  }

  // #endregion

  // #region client

  updateClient() {
    const message: WorkerOutgoingPostMessage<
      ActionSuccess<SyncStatePayload, WORKER_ACTION_TYPE.SYNC_STATE>
    > = {
      id: crypto.randomUUID(),
      data: {
        type: WORKER_ACTION_TYPE.SYNC_STATE,
        payload: {
          stackMaxSize: this.actionStack.maxStackSize,
          stackCount: this.actionStack.length,
          stackIndex: this.actionStack.index,
          layers: this.layerManager.layers.map<LayerDescription>(layer => ({
            locked: layer.locked,
            order: layer.order,
            id: layer.id,
            name: layer.name,
            opacity: layer.opacity,
            visible: layer.visible,
            blendMode: layer.blendMode,
            dimension: layer.dimension
          })),
          currentLayerId: this.layerManager.getCurrentLayerId()
        }
      }
    };
    return this.action(message);
  }

  // #endregion
}

export default new Context();

async function action<
  T =
    | WorkerOutgoingPostMessage<ManagerWorkerIncomingAction>
    | WorkerOutgoingPostMessage<DisplayWorkerIncomingAction>
>(
  messagePort: MessagePort | WorkerGlobal,
  message: T,
  transfer?: Transferable[]
) {
  const data = await lastValueFrom(
    of<T>(message).pipe(serializeWorkerPostMessage())
  );
  messagePort.postMessage(data, transfer || []);
}

async function sendSetupMessage(
  displayWorkerPorts: MessagePort[],
  sharedBuffer: BufferDescription
) {
  const message = {
    id: crypto.randomUUID(),
    data: {
      type: WORKER_ACTION_TYPE.UPDATE_BUFFER,
      payload: {
        sharedBuffer
      } as UpdateBufferPayload
    }
  };
  await Promise.all(
    displayWorkerPorts.map(messagePort => action(messagePort, message))
  );
}

async function sendUpdateMessage(displayWorkerPorts: MessagePort[]) {
  const message = {
    id: crypto.randomUUID(),
    data: {
      type: WORKER_ACTION_TYPE.UPDATE_CANVAS
    }
  };
  await Promise.all(
    displayWorkerPorts.map(messagePort => action(messagePort, message))
  );
}
