import type { DisplayIncomingPostMessage } from '../types/worker';
import type { DisplayWorkerIncomingAction } from '../types/worker.message.display';
import logger from '../utils/logger';
import actions from './display/actions';
import context from './display/context';

self.onmessage = (
  event: MessageEvent<DisplayIncomingPostMessage<DisplayWorkerIncomingAction>>
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
