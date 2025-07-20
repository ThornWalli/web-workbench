import { WORKER_ACTION_TYPE } from '../../../../types/worker';
import type { ActionSuccess } from '../../../../types/worker';
import type { IContext } from '../../../../types/worker/main';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import type {
  GetDataPayload,
  GetDataSuccessPayload
} from '../../../../types/worker.payload';

export default async function getData(
  context: IContext,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  data: ActionCommandToMainWorker<GetDataPayload>
): Promise<Promise<[ActionSuccess<GetDataSuccessPayload>, Transferable[]]>> {
  return [
    {
      type: WORKER_ACTION_TYPE.GET_DATA_SUCCESS,
      payload: {
        dimension: context.getDimension(),
        buffer: new Uint8ClampedArray(context.layerManager.view)
      }
    },
    []
  ];
}
