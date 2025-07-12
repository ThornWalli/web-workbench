import type {
  DisplayWorkerIncomingAction,
  ActionCommandToDisplayWorker
} from '@web-workbench/disk-web-paint/webPaint/types/worker.message.display';

import { WORKER_ACTION_TYPE } from '@web-workbench/disk-web-paint/webPaint/types/worker';
import type {
  ActionSuccess,
  DisplayIncomingPostMessage
} from '@web-workbench/disk-web-paint/webPaint/types/worker';
import messages from '../../display.actions';
import { throwError } from '../../utils';
import type { Context } from '@web-workbench/disk-web-paint/webPaint/types/worker/display';

import type {
  InitDisplayPayload,
  InitDisplaySucessPayload
} from '@web-workbench/disk-web-paint/webPaint/types/worker.payload';

export default async function initMessage(
  context: Context,
  data: ActionCommandToDisplayWorker<
    InitDisplayPayload,
    WORKER_ACTION_TYPE.INIT
  >
): Promise<ActionSuccess<InitDisplaySucessPayload>> {
  const { debug, canvas, port, options } = data.payload;

  context.debug = debug;
  context.options = options;
  context.canvas = canvas;
  context.ctx = context.canvas!.getContext('2d', {
    willReadFrequently: true
  });
  context.ctx!.imageSmoothingEnabled = false;
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
