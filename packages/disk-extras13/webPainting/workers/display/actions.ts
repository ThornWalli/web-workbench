import type { DisplayContext } from '../../types/worker';
import { WORKER_ACTION_TYPE } from '../../types/worker';
import type {
  DisplayWorkerIncomingAction,
  InitMessageToDisplayWorker,
  RefreshActionToDisplayWorker,
  UpdateCanvasMessageToDisplayWorker
} from '../../types/worker.message.display';
import { display as logger } from '../../utils/logger';
import debug from './actions/debug';
import initMessage from './actions/init';
import refresh from './actions/refresh';
import updateCanvasMessage from './actions/updateCanvas';

export default async function (
  context: DisplayContext,
  data: DisplayWorkerIncomingAction
) {
  const { type } = data;

  logger.withTag('action').start(data);

  switch (type) {
    case WORKER_ACTION_TYPE.INIT: {
      return initMessage(context, data as InitMessageToDisplayWorker);
    }

    case WORKER_ACTION_TYPE.UPDATE_CANVAS: {
      return updateCanvasMessage(
        context,
        data as UpdateCanvasMessageToDisplayWorker
      );
    }

    case WORKER_ACTION_TYPE.REFRESH: {
      return refresh(context, data as RefreshActionToDisplayWorker);
    }

    case WORKER_ACTION_TYPE.DEBUG: {
      console.log('[Zoom Worker] Debug message received:', data);
      return debug(context, data);
    }

    default:
      console.warn(
        '[Zoom Worker] Unknown message type from Creator Thread:',
        type
      );
  }
}
