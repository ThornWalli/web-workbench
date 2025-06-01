import type { MainIncomingPostMessage } from '../types/worker';
import type { MainWorkerIncomingAction } from '../types/worker.message.main';
import { mainWorker as logger } from '../utils/logger';

import actions from './main/actions';
import context from './main/context';

self.onmessage = (
  event: MessageEvent<MainIncomingPostMessage<MainWorkerIncomingAction>>
) => {
  const { id, data } = event.data;

  actions(context, data)
    .then(data => {
      if (data) {
        context.action({ id, data });
      }
    })
    .catch(error => {
      logger.error('Error processing action:', error);
    });
};
