import type WorkerManager from '../../lib/classes/WorkerManager';
import { WORKER_ACTION_TYPE } from '../../types/worker';
import type { ClientIncomingAction } from '../../types/worker.message.client';
import type { DisplayWorkerIncomingAction } from '../../types/worker.message.display';
import logger from '../../utils/logger';

export default async function actionsMain(
  workerManager: WorkerManager,
  data: DisplayWorkerIncomingAction | ClientIncomingAction
) {
  switch (data.type) {
    case WORKER_ACTION_TYPE.INIT:
      {
        logger
          .withTag('Incoming')
          .withTag('action')
          .withTag(WORKER_ACTION_TYPE.INIT)
          .success(data);
      }
      break;

    case WORKER_ACTION_TYPE.UPDATE_CANVAS:
      {
        console.log('[WorkerManager] BOOOOM', data);
        // Hier können Sie die Logik für die Verarbeitung von Zoom-Updates hinzufügen
      }
      break;

    default:
      {
        logger
          .withTag('Incoming')
          .withTag('main')
          .withTag('action')
          .warn('Action not handled in WorkerManager:', data);
      }
      break;
  }
}
