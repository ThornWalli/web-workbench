import { BRUSH_MODE } from '../../types/select';
import type { BrushSelect, ColorSelect, ToolSelect } from '../../types/select';

import { lastValueFrom, of } from 'rxjs';
import type {
  Context,
  SelectOptions,
  SharedBuffer,
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
} from '@web-workbench/wasm/pkg/wasm';
import { toBrushMode, toColor, toDimension, toPoint } from '../../utils/wasm';
import Dots from '../../lib/classes/brush/Dots';
import Square from '../../lib/classes/brush/Square';

let firstBrushSet = true; // Flag to check if the brush is set for the first time
let lastUseOptions: SelectOptions | undefined = undefined;

const context: Context = {
  debug: false,
  displayWorkerPorts: [],
  sharedBuffer: undefined,
  tmpSharedBuffer: undefined,
  view: undefined,
  lastView: undefined,
  tmpView: undefined,
  // brush: undefined,
  useOptions: {
    tool: getDefaultToolSelect(),
    brush: getDefaultBrushSelect(),
    color: getDefaultColorSelect()
  },
  brushDescription: undefined,

  // #region stack

  actionStack: new Stacker<StackItem>({
    maxStackSize: Infinity,
    onForward: async (stacker: Stacker<StackItem>, newIndex: number) => {
      lastUseOptions = context.useOptions!;
      context.setView(new Uint8Array(context.tmpSharedBuffer!.buffer));
      for (const { payload, selectOptions } of stacker
        .getStackAtIndex(newIndex)
        .flat()) {
        context.setBrush(selectOptions.brush, selectOptions.color);
        await executeAction({ ...context, useOptions: selectOptions }, payload);
      }
      context.updateClient();
      context.updateDisplays();

      if (lastUseOptions) {
        context.setSelectOptions(lastUseOptions);
      }
    },
    onBackward: async (stacker: Stacker<StackItem>, newIndex: number) => {
      lastUseOptions = context.useOptions!;
      context.setView(new Uint8Array(context.tmpSharedBuffer!.buffer));

      for (const { payload, selectOptions } of stacker
        .getStackAtIndex(newIndex)
        .flat()) {
        context.setBrush(selectOptions.brush, selectOptions.color);
        await executeAction({ ...context, useOptions: selectOptions }, payload);
      }

      context.updateClient();
      context.updateDisplays();

      if (lastUseOptions) {
        context.setSelectOptions(lastUseOptions);
      }
    },
    onComplete: async () => {
      context.updateClient();
    },
    onLimitReached: actions => {
      // When the stack limit is reached, the last stack entry is added to the source shared buffer.
      if (context.tmpSharedBuffer?.buffer) {
        const buffer = context.tmpSharedBuffer?.buffer;
        const view = new Uint8Array(buffer);
        lastUseOptions = context.useOptions!;
        actions.forEach(({ payload, selectOptions }) => {
          // Execute the action to modify the shared buffer
          const { tool, meta, toolOptions } = payload;
          context.setBrush(selectOptions.brush, selectOptions.color);
          executeAction(
            {
              ...context,
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
          context.setSelectOptions(lastUseOptions);
        }
      }
    }
  }),

  async addActionStack(name: string, payload: UseToolPayload) {
    await context.actionStack.add({
      name,
      payload,
      selectOptions: cloneSelectOptions(context.useOptions)
    });
  },

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

    context.brushDescription = brushDescription;
  },

  setSelectOptions({
    tool,
    brush,
    color
  }: Partial<{ tool: ToolSelect; brush: BrushSelect; color: ColorSelect }>) {
    if (brush) {
      const brushColor = color || context.useOptions.color;
      context.setBrush(brush, brushColor);
    }
    if (tool) {
      context.useOptions.tool = tool;
    }
    if (brush) {
      context.useOptions.brush = brush;
    }
    if (color) {
      context.useOptions.color = color;
    }
  },

  setSharedBuffer(buffer: SharedArrayBuffer, dimension: IPoint & number) {
    context.sharedBuffer = { buffer, dimension };
    context.tmpSharedBuffer = { buffer: buffer.slice(0), dimension };
    context.view = new Uint8Array(buffer);
    context.removeTmpView();
  },

  getColorByPosition: (position: IPoint & number): Color => {
    const data = getPixels(
      context.view!,
      toDimension(context.getDimension()),
      toPoint(position),
      toDimension(ipoint(1, 1))
    );
    if (data.length < 4) {
      throw new Error(
        `Data length is too short: ${data.length}. Expected at least 4 bytes for RGBA.`
      );
    }
    return new Color(data[0], data[1], data[2], data[3]);
  },
  // #endregion

  // #region getters
  setView(view: Uint8Array) {
    if (view instanceof Uint8Array) {
      context.view?.set(view);
      context.tmpView?.set(view);
    }
  },

  createTmpView() {
    if (!context.tmpView) {
      if (context.sharedBuffer) {
        context.lastView = context.view?.slice(0);
        context.tmpView = new Uint8Array(context.sharedBuffer.buffer.slice(0));
      } else {
        throw new Error('Shared buffer is not set.');
      }
    }
    return context.tmpView;
  },

  updateTmpView() {
    if (context.view) {
      context.tmpView?.set(context.view);
    }
  },

  removeTmpView() {
    if (context.tmpView && context.view && context.lastView) {
      context.view?.set(context.lastView!);
    }
    context.tmpView = undefined;
  },

  getDimension() {
    if (context.sharedBuffer) {
      return ipoint(
        context.sharedBuffer.dimension.x,
        context.sharedBuffer.dimension.y
      );
    }
    throw new Error('Shared buffer is not set.');
  },

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
    const imageDataDimension = context.getDimension();

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
  },

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
  },

  // #endregion

  // #region methods

  getColorAtPosition(position: IPoint) {
    if (!context.view || !context.sharedBuffer) {
      throw new Error('No image data available.');
    }

    const x = Math.floor(position.x);
    const y = Math.floor(position.y);
    const index = (y * context.sharedBuffer.dimension.x + x) * 4;
    const data = context.view;

    if (data[index] !== undefined) {
      return new Color(
        data[index],
        data[index + 1],
        data[index + 2],
        data[index + 3]
      );
    }
  },

  isIntersect(position: IPoint & number): boolean {
    const imageDataDimension = context.getDimension();
    return (
      position.x >= 0 &&
      position.y >= 0 &&
      position.x <= imageDataDimension.x - 1 &&
      position.y <= imageDataDimension.y - 1
    );
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

async function sendSetupMessage(
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
