import { WORKER_ACTION_TYPE } from '../../../../types/worker';
import type { ActionSuccess } from '../../../../types/worker';
import type { IContext } from '../../../../types/worker/main';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import type {
  ResizeCanvasPayload,
  ResizeCanvasSuccessPayload
} from '../../../../types/worker.payload';
import { ORIGIN } from '@web-workbench/disk-web-paint/webPaint/types';
import { point } from '@js-basics/vector';

export default async function resizeCanvas(
  context: IContext,
  data: ActionCommandToMainWorker<ResizeCanvasPayload>
): Promise<[ActionSuccess<ResizeCanvasSuccessPayload>, Transferable[]]> {
  const dimension = context.getDimension();
  const { payload } = data;

  const buffer = new SharedArrayBuffer(
    payload.dimension.x * payload.dimension.y * 4
  );
  const view = new Uint8ClampedArray(buffer);

  let offset = point(0, 0);

  if (
    [ORIGIN.RIGHT, ORIGIN.RIGHT_TOP, ORIGIN.RIGHT_BOTTOM].includes(
      payload.origin
    )
  ) {
    offset.x = payload.dimension.x - dimension.x;
  }
  if (
    [ORIGIN.BOTTOM, ORIGIN.LEFT_BOTTOM, ORIGIN.RIGHT_BOTTOM].includes(
      payload.origin
    )
  ) {
    offset.y = payload.dimension.y - dimension.y;
  }

  if ([ORIGIN.CENTER].includes(payload.origin)) {
    offset = point(() => (payload.dimension - dimension) / 2);
  }

  const offset_ = point(() => Math.floor(offset));
  const offsetN = point(() => Math.min(offset_, 0));
  const offsetP = point(() => Math.max(offset_, 0));

  const height = Math.min(
    context.view!.length / (dimension.x * 4),
    payload.dimension.y
  );

  for (let y = 0; y < height; y++) {
    const y_ = y * dimension.x * 4 + Math.abs(offsetN.y) * dimension.x * 4;

    const lineView = new Uint8ClampedArray(payload.dimension.x * 4);
    console.log(
      'y',
      JSON.stringify(
        {
          y_,
          offsetN,
          offsetP,
          offset,
          x: [y_, y_ + Math.min(dimension.x, payload.dimension.x) * 4]
        },
        null,
        2
      )
    );
    lineView.set(
      context.view!.subarray(
        y_ + Math.abs(offsetN.x * 4),
        y_ +
          Math.min(dimension.x, payload.dimension.x) * 4 +
          Math.abs(offsetN.x * 4)
      ),
      offsetP.x * 4
    );
    // view.set(
    //   context.view!.subarray(
    //     y_ + offset.x * 4 + offset.y * dimension.x * 4,
    //     y_ + offset.x * 4 + offset.y * dimension.x * 4 + payload.dimension.x * 4
    //   ),
    //   y * payload.dimension.x * 4
    // );
    view.set(
      lineView,
      y * payload.dimension.x * 4 + offsetP.y * payload.dimension.x * 4
    );
  }

  context.setSharedBuffer(buffer, payload.dimension);

  context.setupDisplays();
  context.update();

  return [
    {
      type: WORKER_ACTION_TYPE.RESIZE_CANVAS_SUCCESS,
      payload: {
        dimension: context.getDimension()
      }
    },
    []
  ];
}
