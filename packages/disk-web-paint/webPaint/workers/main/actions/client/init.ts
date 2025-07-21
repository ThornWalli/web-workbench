import type {
  InitPayload,
  InitSuccessPayload
} from '../../../../types/worker.payload';
import type { IContext } from '../../../../types/worker/main';
import { WORKER_ACTION_TYPE } from '../../../../types/worker';
import type { ActionSuccess } from '../../../../types/worker';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import { setupWasm } from '@web-workbench/disk-web-paint/webPaint/utils/wasm';

export default async function initMessage(
  context: IContext,
  data: ActionCommandToMainWorker<InitPayload>
): Promise<ActionSuccess<InitSuccessPayload>> {
  context.debug = data.payload.debug;

  await setupWasm();

  context.updateClient();

  return {
    type: WORKER_ACTION_TYPE.INIT_SUCCESS
  };
}
