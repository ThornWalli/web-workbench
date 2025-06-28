import type { ActionCommandToDisplayWorker } from '@web-workbench/disk-extras13/webPainting/types/worker.message.display';
import {
  WORKER_ACTION_TYPE,
  type ActionSuccess
} from '@web-workbench/disk-extras13/webPainting/types/worker';
import type { Context } from '@web-workbench/disk-extras13/webPainting/types/display';

import type {
  SetDisplayOptionsPayload,
  SetDisplayOptionsSuccessPayload
} from '@web-workbench/disk-extras13/webPainting/types/worker.payload';

export default async function setOptions(
  context: Context,
  data: ActionCommandToDisplayWorker<
    SetDisplayOptionsPayload,
    WORKER_ACTION_TYPE.SET_OPTIONS
  >
): Promise<ActionSuccess<SetDisplayOptionsSuccessPayload>> {
  const { options } = data.payload;

  context.options = options;
  context.updateCanvas();
  return {
    type: WORKER_ACTION_TYPE.SET_OPTIONS_SUCCESS
  };
}
