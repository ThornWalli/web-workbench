import { fromEvent, map } from 'rxjs';
import { deserializeWorkerPostMessage } from '../operators';
import type { DisplayIncomingPostMessage } from '../types/worker';
import type { DisplayWorkerIncomingAction } from '../types/worker.message.display';
import logger from '../utils/logger';

import actions from './display/display.actions';
import context from './display/display.context';

fromEvent<
  MessageEvent<DisplayIncomingPostMessage<DisplayWorkerIncomingAction>>
>(self, 'message')
  .pipe(
    map(event => event.data),
    deserializeWorkerPostMessage()
  )
  .subscribe(async ({ id, data }) => {
    try {
      const actionData = await actions(context, data);
      if (actionData) {
        context.action({ id, data: actionData });
      }
    } catch (error) {
      logger.error('Error processing action:', error);
    }
  });
