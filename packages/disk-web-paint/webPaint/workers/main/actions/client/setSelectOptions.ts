import { WORKER_ACTION_TYPE } from '../../../../types/worker';
import type { ActionSuccess } from '../../../../types/worker';
import type { Context } from '../../../../types/main';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import type {
  SetOptionsPayload,
  SetOptionsSuccessPayload
} from '../../../../types/worker.payload';

export default async function setSelectOptions(
  context: Context,
  data: ActionCommandToMainWorker<SetOptionsPayload>
): Promise<ActionSuccess<SetOptionsSuccessPayload>> {
  await context.setSelectOptions(data.payload);
  return {
    type: WORKER_ACTION_TYPE.SET_SELECT_OPTIONS_SUCCESS
  };
}
