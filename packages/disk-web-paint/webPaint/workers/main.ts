import { fromEvent, map } from 'rxjs';
import { deserializeWorkerPostMessage } from '../operators';
import type { MainIncomingPostMessage } from '../types/worker';
import type { MainWorkerIncomingAction } from '../types/worker.message.main';
import { mainWorker as logger } from '../utils/logger';

import actions from './main/main.actions';
import context from './main/main.context';

fromEvent<MessageEvent<MainIncomingPostMessage<MainWorkerIncomingAction>>>(
  self,
  'message'
)
  .pipe(
    map(event => event.data),
    deserializeWorkerPostMessage()
  )
  .subscribe(async ({ id, data, transfer }) => {
    try {
      let actionData = await actions(context, data);

      if (Array.isArray(actionData)) {
        transfer = actionData[1];
        actionData = actionData[0];
      }
      if (actionData) {
        context.action({ id, data: actionData }, transfer);
      }
    } catch (error) {
      logger.error('Error processing action:', error);
    }
  });
