import { WORKER_ACTION_TYPE } from '../../../../types/worker';
import type { ActionSuccess } from '../../../../types/worker';
import type { Context } from '../../../../types/main';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import type {
  GetColorsPayload,
  GetColorsSuccessPayload
} from '../../../../types/worker.payload';
import Color from '../../../../lib/classes/Color';

export default async function getColors(
  context: Context,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  data: ActionCommandToMainWorker<GetColorsPayload>
): Promise<Promise<[ActionSuccess<GetColorsSuccessPayload>, Transferable[]]>> {
  const view = context.view!;

  const colors = new Set<string>();

  for (let i = 0; i < view.length; i += 4) {
    const color = new Color(view[i], view[i + 1], view[i + 2], view[i + 3]);
    colors.add(color.toHex());
  }

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
