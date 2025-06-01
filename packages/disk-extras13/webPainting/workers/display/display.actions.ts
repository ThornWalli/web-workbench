import type { Context } from '../../types/display';
import { WORKER_ACTION_TYPE } from '../../types/worker';
import type { DisplayWorkerIncomingAction } from '../../types/worker.message.display';
import { display as logger } from '../../utils/logger';

import mainInitAction from './actions/client/init';
import clientRefresh from './actions/client/refresh';
import clientDebug from './actions/client/debug';
import updateCanvasMessage from './actions/main/updateCanvas';
import setZoomAction from './actions/client/setZoom';
import setPositionAction from './actions/client/setPosition';

export default async function (
  context: Context,
  data: DisplayWorkerIncomingAction
) {
  const { type } = data;

  const actionLogger = logger.withTag('action');
  actionLogger.start(data);

  switch (type) {
    case WORKER_ACTION_TYPE.INIT: {
      return mainInitAction(context, data);
    }

    case WORKER_ACTION_TYPE.UPDATE_CANVAS: {
      return updateCanvasMessage(context, data);
    }

    case WORKER_ACTION_TYPE.REFRESH: {
      return clientRefresh(context, data);
    }

    case WORKER_ACTION_TYPE.SET_ZOOM: {
      return setZoomAction(context, data);
    }

    case WORKER_ACTION_TYPE.SET_POSITION: {
      return setPositionAction(context, data);
    }

    case WORKER_ACTION_TYPE.DEBUG: {
      return clientDebug(context, data);
    }

    default:
      actionLogger.warn('Unknown message type from Creator Thread:', type);
  }
}
