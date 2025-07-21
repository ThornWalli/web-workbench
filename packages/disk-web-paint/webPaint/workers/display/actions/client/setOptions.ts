import type { ActionCommandToDisplayWorker } from '@web-workbench/disk-web-paint/webPaint/types/worker.message.display';
import { WORKER_ACTION_TYPE } from '@web-workbench/disk-web-paint/webPaint/types/worker';
import type { ActionSuccess } from '@web-workbench/disk-web-paint/webPaint/types/worker';
import type { IContext } from '@web-workbench/disk-web-paint/webPaint/types/worker/display';

import type {
  SetDisplayOptionsPayload,
  SetDisplayOptionsSuccessPayload
} from '@web-workbench/disk-web-paint/webPaint/types/worker.payload';

export default async function setOptions(
  context: IContext,
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
