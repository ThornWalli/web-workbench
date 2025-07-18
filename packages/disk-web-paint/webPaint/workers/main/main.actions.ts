import { WORKER_ACTION_TYPE } from '../../types/worker';
import clientAddDisplayWorkerPortAction from './actions/client/addDisplayWorkerPort';
import clientInitAction from './actions/client/init';
import clientLoadImageAction from './actions/client/loadImage';

import clientSetOptionsAction from './actions/client/setSelectOptions';
import clientUseToolAction from './actions/client/useTool';
import clientStackAction from './actions/client/stack';

import clientGetDataAction from './actions/client/getData';

import { mainWorker as logger } from '../../utils/logger';
import type { MainWorkerIncomingAction } from '../../types/worker.message.main';
import type { Context } from '../../types/worker/main';
import insertImageAction from './actions/client/insertImage';
import resizeAction from './actions/client/resize';
import resizeCanvasAction from './actions/client/resizeCanvas';
import getColorsAction from './actions/client/getColors';
import flipAction from './actions/client/flip';
import rotateAction from './actions/client/rotate';

// eslint-disable-next-line complexity
export default async function (
  context: Context,
  data: MainWorkerIncomingAction
) {
  const { type } = data;
  const actionLogger = logger.withTag('Incoming').withTag('action');
  if (context.debug) {
    actionLogger.withTag(type).start(data);
  }

  switch (type) {
    case WORKER_ACTION_TYPE.INIT: {
      return clientInitAction(context, data);
    }

    case WORKER_ACTION_TYPE.ADD_RENDER_WORKER_PORT: {
      return clientAddDisplayWorkerPortAction(context, data);
    }

    case WORKER_ACTION_TYPE.SET_SELECT_OPTIONS: {
      return clientSetOptionsAction(context, data);
    }

    case WORKER_ACTION_TYPE.USE_TOOL: {
      return clientUseToolAction(context, data);
    }

    case WORKER_ACTION_TYPE.LOAD_IMAGE: {
      return clientLoadImageAction(context, data);
    }

    case WORKER_ACTION_TYPE.STACK: {
      return clientStackAction(context, data);
    }

    case WORKER_ACTION_TYPE.GET_DATA: {
      return clientGetDataAction(context, data);
    }

    case WORKER_ACTION_TYPE.INSERT_IMAGE: {
      return insertImageAction(context, data);
    }

    case WORKER_ACTION_TYPE.RESIZE: {
      return resizeAction(context, data);
    }

    case WORKER_ACTION_TYPE.RESIZE_CANVAS: {
      return resizeCanvasAction(context, data);
    }

    case WORKER_ACTION_TYPE.GET_COLORS: {
      return getColorsAction(context, data);
    }

    case WORKER_ACTION_TYPE.FLIP: {
      return flipAction(context, data);
    }

    case WORKER_ACTION_TYPE.ROTATE: {
      return rotateAction(context, data);
    }

    default:
      if (context.debug) {
        actionLogger.warn('Unknown message type from Creator Thread:', type);
      }
  }
}
