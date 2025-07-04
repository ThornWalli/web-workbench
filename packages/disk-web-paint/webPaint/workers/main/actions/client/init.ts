import type {
  InitPayload,
  InitSuccessPayload
} from '../../../../types/worker.payload';
import type { Context } from '../../../../types/main';
import { WORKER_ACTION_TYPE } from '../../../../types/worker';
import type { ActionSuccess } from '../../../../types/worker';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import init from '@web-workbench/wasm';

export default async function initMessage(
  context: Context,
  data: ActionCommandToMainWorker<InitPayload>
): Promise<ActionSuccess<InitSuccessPayload>> {
  context.debug = data.payload.debug;

  await init();

  return {
    type: WORKER_ACTION_TYPE.INIT_SUCCESS
  };
}
