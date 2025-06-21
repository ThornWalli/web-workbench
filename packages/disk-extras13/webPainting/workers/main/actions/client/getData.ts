import {
  WORKER_ACTION_TYPE,
  type ActionSuccess
} from '../../../../types/worker';
import type { Context } from '../../../../types/main';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import type {
  GetDataPayload,
  GetDataSuccessPayload
} from '../../../../types/worker.payload';

export default async function getData(
  context: Context,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  data: ActionCommandToMainWorker<GetDataPayload>
): Promise<Promise<[ActionSuccess<GetDataSuccessPayload>, Transferable[]]>> {
  const buffer = new Uint8ClampedArray(context.sharedBuffer!.buffer);
  return [
    {
      type: WORKER_ACTION_TYPE.GET_DATA_SUCCESS,
      payload: {
        dimension: context.getDimension(),
        buffer
      }
    },
    []
  ];
}
