import { WORKER_ACTION_TYPE } from '../../types/worker';
import clientAddDisplayWorkerPortAction from './actions/client/addDisplayWorkerPort';
import clientInitAction from './actions/client/init';
import clientLoadImageAction from './actions/client/loadImage';

import clientSetOptionsAction from './actions/client/setSelectOptions';
import clientUseToolAction from './actions/client/useTool';
import clientStackAction from './actions/client/stack';

import { mainWorker as logger } from '../../utils/logger';
import type { MainWorkerIncomingAction } from '../../types/worker.message.main';
import type { Context } from '../../types/main';

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

    // case WORKER_ACTION_TYPE.DRAW_RECTANGLE: {
    //   return clientDrawRectangleAction(context, data);
    // }

    case WORKER_ACTION_TYPE.LOAD_IMAGE: {
      return clientLoadImageAction(context, data);
    }

    case WORKER_ACTION_TYPE.STACK: {
      return clientStackAction(context, data);
    }

    default:
      if (context.debug) {
        actionLogger.warn('Unknown message type from Creator Thread:', type);
      }
  }
}
