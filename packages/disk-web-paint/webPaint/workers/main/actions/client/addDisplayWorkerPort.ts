import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import type { IContext } from '../../../../types/worker/main';
import { mainWorker as logger } from '../../../../utils/logger';
import { WORKER_ACTION_TYPE } from '../../../../types/worker';
import type { ActionSuccess } from '../../../../types/worker';
import type { AddDisplayWorkerPortPayload } from '../../../../types/worker.payload';

export default function addDisplayWorkerPort(
  context: IContext,
  data: ActionCommandToMainWorker<AddDisplayWorkerPortPayload>
): ActionSuccess {
  const addPortPayload = data.payload;
  if (addPortPayload.port) {
    context.displayWorkerPorts.push(addPortPayload.port);
    if (context.debug) {
      logger
        .withTag('action')
        .success(
          'Added zoom worker port. Total ports:',
          context.displayWorkerPorts.length
        );
    }

    context.setupDisplays();
  }
  return {
    type: WORKER_ACTION_TYPE.ADD_RENDER_WORKER_PORT_SUCCESS
  };
}
