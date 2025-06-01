import type {
  DisplayWorkerIncomingAction,
  ActionCommandToDisplayWorker
} from '@web-workbench/disk-extras13/webPainting/types/worker.message.display';

import {
  WORKER_ACTION_TYPE,
  type ActionSuccess,
  type DisplayIncomingPostMessage
} from '@web-workbench/disk-extras13/webPainting/types/worker';
import messages from '../../actions';
import { throwError } from '../../utils';
import type { Context } from '@web-workbench/disk-extras13/webPainting/types/display';
import { DisplayOptions } from '@web-workbench/disk-extras13/webPainting/lib/classes/Display';
import type {
  InitDisplayPayload,
  InitDisplaySucessPayload
} from '@web-workbench/disk-extras13/webPainting/types/worker.payload';

export default async function initMessage(
  context: Context,
  data: ActionCommandToDisplayWorker<
    InitDisplayPayload,
    WORKER_ACTION_TYPE.INIT
  >
): Promise<ActionSuccess<InitDisplaySucessPayload>> {
  const { canvas, port, options } = data.payload;

  context.options = DisplayOptions.fromJSON(options);

  context.offscreenCanvas = canvas;
  context.ctx = context.offscreenCanvas!.getContext('2d', {
    willReadFrequently: true
  });
  context.mainWorkerPort = port;

  if (context.mainWorkerPort) {
    context.mainWorkerPort.onmessage = onMessage(context);
  } else {
    throwError('mainWorkerPort not received in init message!');
  }
  return {
    type: WORKER_ACTION_TYPE.INIT_SUCCESS
  };
}

function onMessage(context: Context) {
  return (
    event: MessageEvent<DisplayIncomingPostMessage<DisplayWorkerIncomingAction>>
  ) => {
    messages(context, event.data.data);
  };
}
