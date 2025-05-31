import type {
  InitMessageToDisplayWorker,
  DisplayWorkerIncomingAction
} from '@web-workbench/disk-extras13/webPainting/types/worker.message.display';

import type {
  ActionSuccess,
  DisplayIncomingPostMessage,
  DisplayContext
} from '@web-workbench/disk-extras13/webPainting/types/worker';
import messages from '../actions';
import { throwError } from '../utils';

export default function initMessage(
  context: DisplayContext,
  data: InitMessageToDisplayWorker
): Promise<ActionSuccess> {
  const { canvas } = data.payload;
  context.offscreenCanvas = canvas;
  context.ctx = context.offscreenCanvas!.getContext('2d', {
    willReadFrequently: true
  });
  context.mainWorkerPort = data.port;

  if (context.mainWorkerPort) {
    context.mainWorkerPort.onmessage = onMessage(context);
  } else {
    throwError('mainWorkerPort not received in init message!');
  }
  return Promise.resolve({
    type: data.type
  });
}

function onMessage(context: DisplayContext) {
  return (
    event: MessageEvent<DisplayIncomingPostMessage<DisplayWorkerIncomingAction>>
  ) => {
    messages(context, event.data.data);
  };
}
