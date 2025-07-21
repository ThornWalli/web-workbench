import type { IContext } from '../../types/worker/display';
import { WORKER_ACTION_TYPE } from '../../types/worker';
import type { DisplayWorkerIncomingAction } from '../../types/worker.message.display';
import { display as logger } from '../../utils/logger';

import mainInitAction from './actions/client/init';
import clientRefresh from './actions/client/refresh';
import clientDebug from './actions/client/debug';
import updateBufferAction from './actions/main/updateBuffer';
import setOptionsAction from './actions/client/setOptions';
import setZoomAction from './actions/client/setZoom';
import setZoomFitAction from './actions/client/zoomFit';
import setPositionAction from './actions/client/setPosition';
import updateCanvasAction from './actions/main/updateCanvas';
import setLayersAction from './actions/main/setLayers';

// eslint-disable-next-line complexity
export default async function (
  context: IContext,
  data: DisplayWorkerIncomingAction
) {
  const { type } = data;
  const actionLogger = logger.withTag('Incoming').withTag('action');

  if (context.debug) {
    actionLogger.withTag(type).start(data);
  }

  switch (type) {
    case WORKER_ACTION_TYPE.INIT: {
      return mainInitAction(context, data);
    }

    case WORKER_ACTION_TYPE.UPDATE_BUFFER: {
      return updateBufferAction(context, data);
    }

    case WORKER_ACTION_TYPE.UPDATE_CANVAS: {
      return updateCanvasAction(context, data);
    }

    case WORKER_ACTION_TYPE.SET_LAYERS: {
      return setLayersAction(context, data);
    }

    case WORKER_ACTION_TYPE.REFRESH: {
      return clientRefresh(context, data);
    }

    case WORKER_ACTION_TYPE.SET_OPTIONS: {
      return setOptionsAction(context, data);
    }

    case WORKER_ACTION_TYPE.SET_ZOOM: {
      return setZoomAction(context, data);
    }

    case WORKER_ACTION_TYPE.ZOOM_FIT: {
      return setZoomFitAction(context, data);
    }

    case WORKER_ACTION_TYPE.SET_POSITION: {
      return setPositionAction(context, data);
    }

    case WORKER_ACTION_TYPE.DEBUG: {
      return clientDebug(context, data);
    }

    default:
      if (context.debug) {
        actionLogger.warn('Unknown message type from Creator Thread:', type);
      }
  }
}
