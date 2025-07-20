import { WORKER_ACTION_TYPE } from '../../types/worker';
import clientAddDisplayWorkerPortAction from './actions/client/addDisplayWorkerPort';
import clientInitAction from './actions/client/init';
import clientLoadImageAction from './actions/client/loadImage';
import clientLoadDocumentAction from './actions/client/loadDocument';

import clientSetOptionsAction from './actions/client/setSelectOptions';
import clientUseToolAction from './actions/client/useTool';
import clientStackAction from './actions/client/stack';

import clientGetDataAction from './actions/client/getData';

import { mainWorker as logger } from '../../utils/logger';
import type { MainWorkerIncomingAction } from '../../types/worker.message.main';
import type { IContext } from '../../types/worker/main';
import clientInsertImageAction from './actions/client/insertImage';
import clientResizeAction from './actions/client/resize';
import clientResizeCanvasAction from './actions/client/resizeCanvas';
import clientGetColorsAction from './actions/client/getColors';
import clientFlipAction from './actions/client/flip';
import clientRotateAction from './actions/client/rotate';
// Layer Actions
import clientSetCurrentLayerAction from './actions/client/layer/selectLayer';
import clientAddLayerAction from './actions/client/layer/addLayer';
import clientGetLayersAction from './actions/client/layer/getLayers';
import clientUpdateLayerAction from './actions/client/layer/updateLayer';
import clientMoveLayerAction from './actions/client/layer/moveLayer';
import clientDuplicateLayerAction from './actions/client/layer/duplicateLayer';
import clientMergeLayersAction from './actions/client/layer/mergeLayers';

// eslint-disable-next-line complexity
export default async function (
  context: IContext,
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

    case WORKER_ACTION_TYPE.LOAD_DOCUMENT: {
      return clientLoadDocumentAction(context, data);
    }

    case WORKER_ACTION_TYPE.STACK: {
      return clientStackAction(context, data);
    }

    case WORKER_ACTION_TYPE.GET_DATA: {
      return clientGetDataAction(context, data);
    }

    case WORKER_ACTION_TYPE.INSERT_IMAGE: {
      return clientInsertImageAction(context, data);
    }

    case WORKER_ACTION_TYPE.RESIZE: {
      return clientResizeAction(context, data);
    }

    case WORKER_ACTION_TYPE.RESIZE_CANVAS: {
      return clientResizeCanvasAction(context, data);
    }

    case WORKER_ACTION_TYPE.GET_COLORS: {
      return clientGetColorsAction(context, data);
    }

    case WORKER_ACTION_TYPE.FLIP: {
      return clientFlipAction(context, data);
    }

    case WORKER_ACTION_TYPE.ROTATE: {
      return clientRotateAction(context, data);
    }

    // #region Layer Actions

    case WORKER_ACTION_TYPE.SELECT_LAYER: {
      return clientSetCurrentLayerAction(context, data);
    }

    case WORKER_ACTION_TYPE.ADD_LAYER: {
      return clientAddLayerAction(context, data);
    }

    case WORKER_ACTION_TYPE.GET_LAYERS: {
      return clientGetLayersAction(context, data);
    }

    case WORKER_ACTION_TYPE.UPDATE_LAYER: {
      return clientUpdateLayerAction(context, data);
    }
    case WORKER_ACTION_TYPE.MOVE_LAYERS: {
      return clientMoveLayerAction(context, data);
    }
    case WORKER_ACTION_TYPE.DUPLICATE_LAYER: {
      return clientDuplicateLayerAction(context, data);
    }
    case WORKER_ACTION_TYPE.MERGE_LAYERS: {
      return clientMergeLayersAction(context, data);
    }
    // #endregion

    default:
      if (context.debug) {
        actionLogger.warn('Unknown message type from Creator Thread:', type);
      }
  }
}
