import type { App } from '../../lib/App';
import type WorkerManager from '../../lib/classes/WorkerManager';
import { CONFIG_NAMES } from '../../types';
import { WORKER_ACTION_TYPE } from '../../types/worker';
import type { ClientIncomingAction } from '../../types/worker.message.client';
import type {
  RefreshSucessPayload,
  SyncStatePayload
} from '../../types/worker.payload';
import logger from '../../utils/logger';

export default async function actionsMain(
  workerManager: WorkerManager,
  app: App,
  data: ClientIncomingAction
) {
  switch (data.type) {
    case WORKER_ACTION_TYPE.INIT:
      {
        if (workerManager.options.debug) {
          logger
            .withTag('Incoming')
            .withTag('action')
            .withTag(WORKER_ACTION_TYPE.INIT)
            .success(data);
        }
      }
      break;

    case WORKER_ACTION_TYPE.LOAD_IMAGE_SUCCESS:
      {
        if (workerManager.config.get(CONFIG_NAMES.WEB_PAINT_FIT_IMAGE_ACTIVE)) {
          app.displays.forEach(display => {
            display.actions.fitZoom();
          });
        }
      }
      break;

    case WORKER_ACTION_TYPE.SYNC_STATE:
      {
        app.setState(data.payload as SyncStatePayload);
      }
      break;

    case WORKER_ACTION_TYPE.UPDATE_BUFFER:
      {
        console.log('[WorkerManager] BOOOOM', data);
      }
      break;

    case WORKER_ACTION_TYPE.RESIZE_CANVAS_SUCCESS:
      {
        const payload = data.payload as RefreshSucessPayload;
        app.currentDocument?.setDimension(payload.dimension);
      }
      break;

    default:
      {
        if (workerManager.options.debug) {
          logger
            .withTag('Incoming')
            .withTag('main')
            .withTag('action')
            .warn('Action not handled in WorkerManager:', data);
        }
      }
      break;
  }
}
