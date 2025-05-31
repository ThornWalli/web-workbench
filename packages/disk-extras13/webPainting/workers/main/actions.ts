import type { MainContext } from '../../types/worker';
import { WORKER_ACTION_TYPE } from '../../types/worker';
import addDisplayWorkerPortAction from './actions/addDisplayWorkerPort';
import initAction from './actions/init';
import drawRectangleAction from './actions/drawRectangle';
import loadImageAction from './actions/loadImage';

import replaceCanvasAction from './actions/replaceCanvas';
import { mainWorker as logger } from '../../utils/logger';
import type {
  ActionCommandToMainWorker,
  AddDisplayWorkerPortMessage,
  InitActionToMainWorker,
  MainWorkerIncomingAction,
  ReplaceCanvasActionToMainWorker
} from '../../types/worker.message.main';
import type {
  DrawRectanglePayload,
  LoadImagePayload
} from '../../types/worker.payload';

export default async function (
  context: MainContext,
  data: MainWorkerIncomingAction
) {
  const { type } = data;

  logger.withTag('Incoming').withTag('action').withTag(type).start(data);

  switch (type) {
    case WORKER_ACTION_TYPE.INIT: {
      return initAction(context, data as InitActionToMainWorker);
    }

    case WORKER_ACTION_TYPE.REPLACE_CANVAS: {
      return replaceCanvasAction(
        context,
        data as ReplaceCanvasActionToMainWorker
      );
    }

    case WORKER_ACTION_TYPE.ADD_RENDER_WORKER_PORT: {
      return addDisplayWorkerPortAction(
        context,
        data as AddDisplayWorkerPortMessage
      );
    }

    case WORKER_ACTION_TYPE.DRAW_RECTANGLE: {
      return drawRectangleAction(
        context,
        data as ActionCommandToMainWorker<DrawRectanglePayload>
      );
    }

    case WORKER_ACTION_TYPE.LOAD_IMAGE: {
      return loadImageAction(
        context,
        data as ActionCommandToMainWorker<LoadImagePayload>
      );
    }

    default:
      console.warn('Main Canvas Worker: Unknown message type', type);
  }
}
