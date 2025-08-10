import { BRUSH_MODE } from '../../types/select';
import type { BrushSelect, ColorSelect, ToolSelect } from '../../types/select';

import { lastValueFrom, of, Subscription } from 'rxjs';
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
import Color from '@web-workbench/core/classes/Color';
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
import type { Value } from '../../operators/serializer/replacer';

let firstBrushSet = true; // Flag to check if the brush is set for the first time
let lastUseOptions: SelectOptions | undefined = undefined;

export class Context implements IContext {
  subscription = new Subscription();

  debug: false;
  displayWorkerPorts = [];
  useOptions = {
    tool: getDefaultToolSelect(),
    brush: getDefaultBrushSelect(),
    color: getDefaultColorSelect()
  };
  brushDescription;
  actionStack: Stacker<StackItem>;
  layerManager: LayerManager;

  constructor(options?: Partial<Context>) {
    if (options) {
      const {
        debug = false,
        displayWorkerPorts = [],
        useOptions = {},
        brushDescription
      } = options;
      Object.assign(this, {
        debug,
        displayWorkerPorts,
        useOptions,
        brushDescription
      });
    }

    // #region layerManager

    this.layerManager = options?.layerManager ?? new LayerManager();

    this.subscription.add(
      this.layerManager.change$.subscribe(async () => {
        this.layerManager.currentLayer?.refreshTmpBuffer();
        this.actionStack.clear();
        await this.update({ layers: true, client: true });
      })
    );

    // #endregion

    // #region actionStack

    this.actionStack =
      options?.actionStack ||
      new Stacker<StackItem>({
        maxStackSize: Infinity
      });

    this.subscription.add(
      this.actionStack.forward$.subscribe(async ({ stacker, newIndex }) => {
        lastUseOptions = this.useOptions!;

        this.layerManager.currentLayer!.removeTmpView();
        this.layerManager.currentLayer!.setView(
          new Uint8Array(this.layerManager.currentLayer?.tmpBuffer.buffer)
        );
        for (const { payload, selectOptions } of stacker
          .getStackAtIndex(newIndex)
          .flat()) {
          this.setBrush(selectOptions.brush, selectOptions.color);

          const contextOveride = new Context({
            ...this,
            useOptions: selectOptions
          });
          await executeAction(contextOveride, payload);
          contextOveride.destroy({ subscription: true });
        }

        await this.update({
          client: true
        });

        if (lastUseOptions) {
          this.setSelectOptions(lastUseOptions);
        }
      })
    );

    this.subscription.add(
      this.actionStack.backward$.subscribe(async ({ stacker, newIndex }) => {
        lastUseOptions = this.useOptions!;

        this.layerManager.currentLayer.removeTmpView();
        this.layerManager.currentLayer.setView(
          new Uint8Array(this.layerManager.currentLayer?.tmpBuffer.buffer)
        );
        for (const { payload, selectOptions } of stacker
          .getStackAtIndex(newIndex)
          .flat()) {
          this.setBrush(selectOptions.brush, selectOptions.color);

          const contextOveride = new Context({
            ...this,
            useOptions: selectOptions
          });
          await executeAction(contextOveride, payload);
          contextOveride.destroy({ subscription: true });
        }

        await this.update({
          client: true
        });

        if (lastUseOptions) {
          this.setSelectOptions(lastUseOptions);
        }
      })
    );

    this.subscription.add(
      this.actionStack.complete$.subscribe(async () => {
        this.update({ client: true });
      })
    );

    this.subscription.add(
      this.actionStack.limitReached$.subscribe(async actions => {
        // When the stack limit is reached, the last stack entry is added to the source shared buffer.
        if (this.layerManager.currentLayer.tmpBuffer?.buffer) {
          const buffer = this.layerManager.currentLayer.tmpBuffer?.buffer;
          const view = new Uint8Array(buffer);
          lastUseOptions = this.useOptions!;
          actions.forEach(async ({ payload, selectOptions }) => {
            // Execute the action to modify the shared buffer
            const { tool, meta, toolOptions } = payload;
            this.setBrush(selectOptions.brush, selectOptions.color);
            await executeAction(
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

            await this.update({
              client: true
            });
          });
          if (lastUseOptions) {
            this.setSelectOptions(lastUseOptions);
          }
        }
      })
    );

    // #endregion
  }

  destroy(
    { subscription }: { subscription: boolean } = { subscription: true }
  ) {
    if (subscription) {
      this.subscription.unsubscribe();
    }
  }

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
  }

  getColorByPosition(position: IPoint & number) {
    const data = getPixels(
      this.layerManager.currentLayer.view!,
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

  // #region view

  // setView(view: Uint8Array) {
  //   this.layerManager.currentLayer?.setView(view);
  // }

  // createTmpView() {
  //   return this.layerManager.currentLayer?.createTmpView();
  // }

  // updateTmpView() {
  //   this.layerManager.currentLayer?.updateTmpView();
  // }

  // removeTmpView() {
  //   this.layerManager.currentLayer?.removeTmpView();
  // }
  // #endregion

  // #region getters

  getDimension() {
    return ipoint(
      this.layerManager.currentLayer.bufferDescription.dimension.x,
      this.layerManager.currentLayer.bufferDescription.dimension.y
    );
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
    options?: { round?: boolean }
  ) {
    const imageDataDimension = this.getDimension();

    let targetPosition = ipoint(
      () =>
        displayPosition * imageDataDimension +
        imageDataDimension / 2 +
        ((position / zoomLevel) * dimension) / 2
    );
    if (options?.round) {
      targetPosition = ipoint(() => Math.round(targetPosition));
    } else {
      targetPosition = ipoint(() => Math.floor(targetPosition));
    }

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
    if (
      !this.layerManager.currentLayer.view ||
      !this.layerManager.currentLayer.bufferDescription
    ) {
      throw new Error('No image data available.');
    }

    const x = Math.floor(position.x);
    const y = Math.floor(position.y);
    const index =
      (y * this.layerManager.currentLayer?.bufferDescription.dimension.x + x) *
      4;
    const data = this.layerManager.currentLayer.view;

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

  async update(options?: { layers?: boolean; client?: boolean }) {
    const { layers, client } = options || {};
    await this.layerManager.update();

    if (client) {
      await this.updateClient();
    }

    if (layers) {
      this.setDisplayLayers();
    }

    return this.updateDisplays();
  }

  // #region display

  // layersTotalView: Uint8Array | undefined = undefined;
  async setupDisplays() {
    await sendSetupMessage(this.displayWorkerPorts, this.layerManager.buffer);
  }

  async updateDisplays() {
    return sendUpdateMessage(this.displayWorkerPorts!, {
      id: crypto.randomUUID(),
      data: {
        type: WORKER_ACTION_TYPE.UPDATE_CANVAS,
        payload: undefined
      }
    });
  }
  async setDisplayLayers() {
    return sendUpdateMessage(this.displayWorkerPorts!, {
      id: crypto.randomUUID(),
      data: {
        type: WORKER_ACTION_TYPE.SET_LAYERS,
        payload: {
          layers: this.layerManager.layers.map(layer => {
            return {
              ...layer.toJSON(),
              current: layer.id === this.layerManager.currentLayer.id,
              buffer: layer.bufferDescription
            };
          })
        }
      }
    });
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
            order: layer.order,
            id: layer.id,
            name: layer.name,
            opacity: layer.opacity,
            visible: layer.visible,
            blendMode: layer.blendMode,
            dimension: layer.dimension,
            bufferDescription: {
              buffer: layer.view!,
              dimension: layer.dimension
            }
          })),
          currentLayerId: this.layerManager.getCurrentLayerId()
        }
      }
    };
    return this.action(message);
  }

  // #endregion
}

const context = new Context();
context.layerManager.addLayer({
  name: 'Default',
  dimension: ipoint(800, 600)
});

export default context;

async function action<
  T extends Value =
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

async function sendUpdateMessage(
  displayWorkerPorts: MessagePort[],
  message: WorkerOutgoingPostMessage<DisplayWorkerIncomingAction>
) {
  await Promise.all(
    displayWorkerPorts.map(messagePort => action(messagePort, message))
  );
}
