import { ipoint } from '@js-basics/vector';
import type Display from '../../lib/classes/Display';
import type WorkerManager from '../../lib/classes/WorkerManager';
import { WORKER_ACTION_TYPE } from '../../types/worker';
import type { ClientIncomingAction } from '../../types/worker.message.client';
import type { DisplayWorkerIncomingAction } from '../../types/worker.message.display';
import logger from '../../utils/logger';
import type { SetZoomSuccessPayload } from '../../types/worker.payload';
import type { App } from '../../lib/App';

export default async function actionsDisplay(
  workerManager: WorkerManager,
  app: App,
  display: Display,
  data: DisplayWorkerIncomingAction | ClientIncomingAction
) {
  switch (data.type) {
    case WORKER_ACTION_TYPE.SET_ZOOM_SUCCESS:
      {
        const { currentZoomLevel } = data.payload as SetZoomSuccessPayload;

        display.setCurrentZoomLevel(currentZoomLevel);

        if (data.payload && 'position' in data.payload) {
          display.options.position = ipoint(
            data.payload.position.x,
            data.payload.position.y
          );
        }
      }
      break;

    default:
      {
        if (workerManager.options.debug) {
          logger
            .withTag('Incoming')
            .withTag('display')
            .withTag('action')
            .warn('Action not handled in WorkerManager:', data);
        }
      }
      break;
  }
}
