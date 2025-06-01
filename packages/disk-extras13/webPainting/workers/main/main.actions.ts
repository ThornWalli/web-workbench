import { WORKER_ACTION_TYPE } from '../../types/worker';
import clientAddDisplayWorkerPortAction from './actions/client/addDisplayWorkerPort';
import clientInitAction from './actions/client/init';
import clientDrawRectangleAction from './actions/client/drawRectangle';
import clientLoadImageAction from './actions/client/loadImage';

import replaceCanvasAction from './actions/client/replaceCanvas';
import { mainWorker as logger } from '../../utils/logger';
import type { MainWorkerIncomingAction } from '../../types/worker.message.main';
import type { Context } from '../../types/main';

export default async function (
  context: Context,
  data: MainWorkerIncomingAction
) {
  const { type } = data;

  logger.withTag('Incoming').withTag('action').withTag(type).start(data);

  switch (type) {
    case WORKER_ACTION_TYPE.INIT: {
      return clientInitAction(context, data);
    }

    case WORKER_ACTION_TYPE.REPLACE_CANVAS: {
      return replaceCanvasAction(context, data);
    }

    case WORKER_ACTION_TYPE.ADD_RENDER_WORKER_PORT: {
      return clientAddDisplayWorkerPortAction(context, data);
    }

    case WORKER_ACTION_TYPE.DRAW_RECTANGLE: {
      return clientDrawRectangleAction(context, data);
    }

    case WORKER_ACTION_TYPE.LOAD_IMAGE: {
      return clientLoadImageAction(context, data);
    }

    default:
      console.warn('Main Canvas Worker: Unknown message type', type);
  }
}
