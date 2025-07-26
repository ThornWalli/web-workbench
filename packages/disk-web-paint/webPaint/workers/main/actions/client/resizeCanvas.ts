import { WORKER_ACTION_TYPE } from '../../../../types/worker';
import type { ActionSuccess } from '../../../../types/worker';
import type { IContext } from '../../../../types/worker/main';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import type {
  ResizeCanvasPayload,
  ResizeCanvasSuccessPayload
} from '../../../../types/worker.payload';
import { ORIGIN } from '@web-workbench/disk-web-paint/webPaint/types';
import type { IPoint } from '@js-basics/vector';
import { point } from '@js-basics/vector';

export default async function resizeCanvas(
  context: IContext,
  data: ActionCommandToMainWorker<ResizeCanvasPayload>
): Promise<[ActionSuccess<ResizeCanvasSuccessPayload>, Transferable[]]> {
  const { payload } = data;

  context.layerManager.layers.forEach(layer => {
    const buffer = new SharedArrayBuffer(
      payload.dimension.x * payload.dimension.y * 4
    );
    const view = new Uint8ClampedArray(buffer);

    view.set(
      processResize(
        layer.view,
        layer.bufferDescription.dimension,
        payload.dimension,
        payload.origin
      ),
      0
    );

    layer.setSharedBuffer(buffer, payload.dimension);
  });

  context.layerManager.setBuffer(
    context.layerManager.currentLayer.bufferDescription.dimension
  );
  context.setupDisplays();
  context.update({ layers: true });

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

export function processResize(
  data: Uint8Array | Uint8ClampedArray,
  dataDimension: IPoint & number,
  dimension: IPoint & number,
  origin: ORIGIN
) {
  const view = new Uint8ClampedArray(dimension.x * dimension.y * 4);
  let offset = point(0, 0);

  if ([ORIGIN.RIGHT, ORIGIN.RIGHT_TOP, ORIGIN.RIGHT_BOTTOM].includes(origin)) {
    offset.x = dimension.x - dataDimension.x;
  }
  if (
    [ORIGIN.BOTTOM, ORIGIN.LEFT_BOTTOM, ORIGIN.RIGHT_BOTTOM].includes(origin)
  ) {
    offset.y = dimension.y - dataDimension.y;
  }

  if ([ORIGIN.CENTER].includes(origin)) {
    offset = point(() => (dimension - dataDimension) / 2);
  }

  const offset_ = point(() => Math.floor(offset));
  const offsetN = point(() => Math.min(offset_, 0));
  const offsetP = point(() => Math.max(offset_, 0));

  const height = Math.min(data.length / (dataDimension.x * 4), dimension.y);

  for (let y = 0; y < height; y++) {
    const y_ =
      y * dataDimension.x * 4 + Math.abs(offsetN.y) * dataDimension.x * 4;

    const lineView = new Uint8ClampedArray(dimension.x * 4);
    console.log(
      'y',
      JSON.stringify(
        {
          y_,
          offsetN,
          offsetP,
          offset,
          x: [y_, y_ + Math.min(dataDimension.x, dimension.x) * 4]
        },
        null,
        2
      )
    );
    lineView.set(
      data.subarray(
        y_ + Math.abs(offsetN.x * 4),
        y_ +
          Math.min(dataDimension.x, dimension.x) * 4 +
          Math.abs(offsetN.x * 4)
      ),
      offsetP.x * 4
    );
    view.set(lineView, y * dimension.x * 4 + offsetP.y * dimension.x * 4);
  }
  return view;
}
