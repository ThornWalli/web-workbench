import type { BrushSelect, ColorSelect } from './../../types/select';
import type { ToolSelect } from './../../../webPaintingOld/lib/types';
import { lastValueFrom, of } from 'rxjs';
import type { Context, SharedBuffer, StackItem } from '../../types/main';
import {
  WORKER_ACTION_TYPE,
  type ActionSuccess,
  type WorkerOutgoingPostMessage
} from '../../types/worker';
import type { DisplayWorkerIncomingAction } from '../../types/worker.message.display';
import type { ManagerWorkerIncomingAction } from '../../types/worker.message.workerManager';
import { serializeWorkerPostMessage } from '../../operators';
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import {
  getDefaultBrushSelect,
  getDefaultColorSelect,
  getDefaultToolSelect
} from '../../lib/utils/select';

import { getBrushData, getBrushSize } from '../../utils/brush';
import type {
  SyncStatePayload,
  UseToolPayload
} from '../../types/worker.payload';
import Stacker from '../../lib/classes/Stacker';
import { executeAction } from './actions/client/useTool';

const context: Context = {
  debug: false,
  displayWorkerPorts: [],
  sharedBuffer: undefined,
  tmpSharedBuffer: undefined,
  view: undefined,
  brush: undefined,
  useOptions: {
    tool: getDefaultToolSelect(),
    brush: getDefaultBrushSelect(),
    color: getDefaultColorSelect()
  },

  // #region stack

  actionStack: new Stacker<StackItem>({
    onForward: async (stacker: Stacker<StackItem>, newIndex: number) => {
      context.view?.set(new Uint8ClampedArray(context.tmpSharedBuffer!.buffer));
      for (const { payload, brush } of stacker
        .getStackAtIndex(newIndex)
        .flat()) {
        await executeAction({ ...context, brush }, payload);
      }
      context.updateClient();
      context.updateDisplays();
    },
    onBackward: async (stacker: Stacker<StackItem>, newIndex: number) => {
      context.view?.set(new Uint8ClampedArray(context.tmpSharedBuffer!.buffer));

      for (const { payload, brush } of stacker
        .getStackAtIndex(newIndex)
        .flat()) {
        await executeAction({ ...context, brush }, payload);
      }

      context.updateClient();
      context.updateDisplays();
    },
    onComplete: async () => {
      context.updateClient();
    },
    onLimitReached: actions => {
      // When the stack limit is reached, the last stack entry is added to the source shared buffer.
      if (context.tmpSharedBuffer?.buffer) {
        const buffer = context.tmpSharedBuffer?.buffer;
        const view = new Uint8ClampedArray(buffer);
        actions.forEach(({ payload, brush }) => {
          const { tool, meta, toolOptions } = payload;
          executeAction(
            {
              ...context,
              brush,
              view
            },
            {
              tool,
              meta,
              toolOptions
            }
          );
        });
      }
    }
  }),

  async addActionStack(name: string, payload: UseToolPayload) {
    await context.actionStack.add({ name, payload, brush: context.brush });
  },

  // #endregion

  // #region setters

  setSelectOptions({
    tool,
    brush,
    color
  }: Partial<{ tool: ToolSelect; brush: BrushSelect; color: ColorSelect }>) {
    if (brush || color) {
      const brushColor = color || context.useOptions.color;
      const BrushDataClass = getBrushData(brush!.type);
      const brushData = new BrushDataClass({
        size: getBrushSize(brush),
        primaryColor: brushColor.primaryColor,
        secondaryColor: brushColor.secondaryColor
      });
      context.brush = brushData;
      if (brush) {
        context.useOptions.brush = brush;
      }
    }
    if (tool) {
      context.useOptions.tool = tool;
    }
    if (color) {
      context.useOptions.color = color;
    }
  },

  setSharedBuffer(buffer: SharedArrayBuffer, dimension: IPoint & number) {
    context.sharedBuffer = { buffer, dimension };
    context.tmpSharedBuffer = { buffer: buffer.slice(0), dimension };
    context.view = new Uint8ClampedArray(buffer);
  },

  setDataRGB(
    position: IPoint & number,
    brushData: Uint8ClampedArray,
    brushSize: IPoint & number
  ) {
    const imageDataDimension = context.getDimension();
    const BYTES_PER_PIXEL = 4;
    for (let y = 0; y < brushSize.y; y++) {
      const sourceRowOffset = y * brushSize.x * BYTES_PER_PIXEL;
      const targetRowOffset =
        (position.y + y) * imageDataDimension.x + position.x;
      context.view?.set(
        brushData.subarray(
          sourceRowOffset,
          sourceRowOffset + brushSize.x * BYTES_PER_PIXEL
        ),
        targetRowOffset * BYTES_PER_PIXEL
      );
    }
  },

  setDataRGBA(
    position: IPoint & number,
    DataTransfer: Uint8ClampedArray,
    DefaultSerializer: IPoint & number
  ) {
    if (!this.view) {
      throw new Error('View is not set. Call setSharedBuffer first.');
    }
    setDataRGBA(position, DataTransfer, DefaultSerializer, this.view);
  },

  // #endregion

  // #region getters

  getDimension() {
    if (context.sharedBuffer) {
      return ipoint(
        context.sharedBuffer.dimension.x,
        context.sharedBuffer.dimension.y
      );
    }
    throw new Error('Shared buffer is not set.');
  },

  getTargetPosition({
    position,
    dimension,
    displayPosition,
    zoomLevel
  }: {
    position: IPoint & number;
    dimension: IPoint & number;
    displayPosition: number;
    zoomLevel: number;
  }) {
    const imageDataDimension = context.getDimension();

    let targetPosition = ipoint(
      () =>
        displayPosition * imageDataDimension +
        imageDataDimension / 2 +
        ((position / zoomLevel) * dimension) / 2
    );
    targetPosition = ipoint(() => Math.round(targetPosition));
    return targetPosition;
  },

  // #endregion

  // ########

  // #region actions

  action(
    message: WorkerOutgoingPostMessage<ManagerWorkerIncomingAction>,
    transfer?: Transferable[]
  ) {
    return action(self, message, transfer);
  },
  actionDisplay() {
    context.displayWorkerPorts.forEach(displayPort => {
      return (
        message: WorkerOutgoingPostMessage<DisplayWorkerIncomingAction>,
        transfer?: Transferable[]
      ) => action(displayPort, message, transfer);
    });
  },

  // #endregion

  // #region display

  setupDisplays() {
    return sendSetupMessage(context.displayWorkerPorts, context.sharedBuffer!);
  },
  updateDisplays() {
    return sendUpdateMessage(context.displayWorkerPorts!);
  },

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
          stackMaxSize: context.actionStack.maxStackSize,
          stackCount: context.actionStack.length,
          stackIndex: context.actionStack.index
        }
      }
    };
    context.action(message);
  }

  // #endregion
};

export default context;

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

function sendSetupMessage(
  displayWorkerPorts: MessagePort[],
  sharedBuffer: SharedBuffer
) {
  const message = {
    id: crypto.randomUUID(),
    data: {
      type: WORKER_ACTION_TYPE.UPDATE_BUFFER,
      payload: {
        sharedBuffer
      }
    }
  };
  displayWorkerPorts.forEach(messagePort => {
    action(messagePort, message);
  });
}

function sendUpdateMessage(displayWorkerPorts: MessagePort[]) {
  const message = {
    id: crypto.randomUUID(),
    data: {
      type: WORKER_ACTION_TYPE.UPDATE_CANVAS
    }
  };
  displayWorkerPorts.forEach(messagePort => {
    action(messagePort, message);
  });
}

function setDataRGBA(
  position: IPoint & number,
  data: Uint8ClampedArray,
  dataSize: IPoint & number,
  view: Uint8ClampedArray
) {
  const BYTES_PER_PIXEL = 4; // RGBA
  const imageDataDimension = context.getDimension();

  const brushData = data;
  const brushSize = dataSize;

  for (let i = 0; i < brushData.length; i += BYTES_PER_PIXEL) {
    const y = Math.floor(i / (brushSize.x * BYTES_PER_PIXEL));
    const x = (i / BYTES_PER_PIXEL) % brushSize.x;

    const targetByteOffset = Math.floor(
      (position.x +
        imageDataDimension.x * position.y +
        x +
        y * imageDataDimension.x) *
        BYTES_PER_PIXEL
    );

    const srcR = brushData[i];
    const srcG = brushData[i + 1];
    const srcB = brushData[i + 2];
    const srcA = brushData[i + 3] / 255;

    const destR = view[targetByteOffset];
    const destG = view[targetByteOffset + 1];
    const destB = view[targetByteOffset + 2];
    const destA = view[targetByteOffset + 3] / 255;

    const outA = srcA + destA * (1 - srcA);

    view[targetByteOffset] = Math.round(
      (srcR * srcA + destR * destA * (1 - srcA)) / outA
    );
    view[targetByteOffset + 1] = Math.round(
      (srcG * srcA + destG * destA * (1 - srcA)) / outA
    );
    view[targetByteOffset + 2] = Math.round(
      (srcB * srcA + destB * destA * (1 - srcA)) / outA
    );
    view[targetByteOffset + 3] = Math.round(outA * 255); // Alpha zurück in 0-255 Bereich
  }
}
