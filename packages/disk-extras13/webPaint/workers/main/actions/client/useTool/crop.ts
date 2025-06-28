import { ipoint } from '@js-basics/vector';
import type { Context, UseToolMeta } from '../../../../../types/main';
import {
  CROP_STATE,
  type CropOptions
} from '@web-workbench/disk-extras13/webPaint/lib/classes/tool/interaction/Crop';
import * as imageOperations from '@web-workbench/disk-extras13/webPaint/utils/imageOperations';

let tmpView: Uint8ClampedArray | undefined = undefined;
let tmpData: Uint8ClampedArray | undefined = undefined;
export default function crop(
  context: Context,
  useToolMeta: UseToolMeta,
  options: CropOptions
) {
  switch (options.state) {
    case CROP_STATE.START:
      {
        // crop
        const { position, dimension } = options;
        const offset = ipoint(() => Math.min(dimension, 0));
        const position_ = ipoint(() => position + offset);
        const width = Math.abs(dimension.x);
        const height = Math.abs(dimension.y);
        tmpData = imageOperations.invert(
          context.getDataRGBA(
            context.getTargetPosition(position_, useToolMeta),
            context.getTargetDimension(ipoint(width, height), useToolMeta)
          )
        );
        context.setDataRGBA(
          context.getTargetPosition(position_, useToolMeta),
          new Uint8ClampedArray(
            Array(tmpData.length / 4)
              .fill([0, 0, 0, 0])
              .flat()
          ),
          context.getTargetDimension(ipoint(width, height), useToolMeta),
          options.copy
        );
        tmpView = new Uint8ClampedArray(context.sharedBuffer!.buffer.slice(0));
      }
      break;
    case CROP_STATE.STOP:
      {
        tmpData = imageOperations.invert(tmpData!);
        draw(context, useToolMeta, options, tmpView);
        if (tmpView) {
          tmpView = undefined;
        }
      }
      break;
    case CROP_STATE.MOVE:
      {
        if (tmpView) {
          draw(context, useToolMeta, options, tmpView);
        }
      }
      break;
  }
}

function draw(
  context: Context,
  useToolMeta: UseToolMeta,
  options: CropOptions,
  view?: Uint8ClampedArray
) {
  if (view) {
    context.view?.set(view);
  }

  const absDimension = ipoint(() => Math.abs(options.dimension));
  const offset = ipoint(() => Math.min(options.dimension, 0));
  const position = ipoint(() => options.position + offset);

  const targetPosition = context.getTargetPosition(position, useToolMeta, {
    round: true
  });
  context.setDataRGBA(
    ipoint(() => Math.round(targetPosition)),
    tmpData!,
    context.getTargetDimension(absDimension, useToolMeta)
  );
}
