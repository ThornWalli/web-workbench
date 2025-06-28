import type {
  InitPayload,
  InitSuccessPayload
} from '../../../../types/worker.payload';
import type { Context } from '../../../../types/main';
import {
  WORKER_ACTION_TYPE,
  type ActionSuccess
} from '../../../../types/worker';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';

export default function initMessage(
  context: Context,
  data: ActionCommandToMainWorker<InitPayload>
): ActionSuccess<InitSuccessPayload> {
  context.debug = data.payload.debug;

  return {
    type: WORKER_ACTION_TYPE.INIT_SUCCESS
  };
}
