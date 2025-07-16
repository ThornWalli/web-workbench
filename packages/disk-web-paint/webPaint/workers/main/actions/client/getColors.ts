import { WORKER_ACTION_TYPE } from '../../../../types/worker';
import type { ActionSuccess } from '../../../../types/worker';
import type { Context } from '../../../../types/worker/main';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import type {
  GetColorsPayload,
  GetColorsSuccessPayload
} from '../../../../types/worker.payload';
import Color from '../../../../lib/classes/Color';
import { getColors as rust_getColors } from '@web-workbench/wasm';

export default async function getfColors(
  context: Context,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  data: ActionCommandToMainWorker<GetColorsPayload>
): Promise<Promise<[ActionSuccess<GetColorsSuccessPayload>, Transferable[]]>> {
  const view = context.view!;
  const colors = rust_getColors(view);
  return [
    {
      type: WORKER_ACTION_TYPE.GET_DATA_SUCCESS,
      payload: {
        colors: Array.from(colors).map(color => Color.fromHex(color))
      }
    },
    []
  ];
}
