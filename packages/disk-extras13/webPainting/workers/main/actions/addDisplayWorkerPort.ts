import type { AddDisplayWorkerPortMessage } from '@web-workbench/disk-extras13/webPainting/types/worker.message.main';
import type { MainContext } from '../../../types/worker';
import { mainWorker as logger } from '@web-workbench/disk-extras13/webPainting/utils/logger';

export default function addDisplayWorkerPort(
  context: MainContext,
  data: AddDisplayWorkerPortMessage
) {
  const addPortPayload = data.payload;
  if (addPortPayload.port) {
    context.displayWorkerPorts.push(addPortPayload.port);
    logger
      .withTag('action')
      .success(
        'Added zoom worker port. Total ports:',
        context.displayWorkerPorts.length
      );

    context.updateDisplays();
  }
}
