import { ipoint } from '@js-basics/vector';
import type { Context, UseToolMeta } from '../../../../../types/main';
import {
  CROP_STATE,
  type CropOptions
} from '@web-workbench/disk-extras13/webPaint/lib/classes/tool/interaction/Crop';
import { getPixels, invert, setPixels } from '@web-workbench/wasm/pkg/wasm';
import {
  toDimension,
  toPoint
} from '@web-workbench/disk-extras13/webPaint/utils/wasm';

let tmpView: Uint8Array | undefined = undefined;
let tmpData: Uint8Array | undefined = undefined;
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
        const tmpDimension = context.getTargetDimension(
          ipoint(width, height),
          useToolMeta
        );
        const pixels = getPixels(
          context.view!,
          toDimension(context.getDimension()),
          toPoint(context.getTargetPosition(position_, useToolMeta)),
          toDimension(tmpDimension)
        );
        tmpData = invert(pixels, toDimension(tmpDimension));
        setPixels(
          context.view!,
          toDimension(context.getDimension()),
          toPoint(context.getTargetPosition(position_, useToolMeta)),
          new Uint8Array(
            Array(tmpData.length / 4)
              .fill([0, 0, 0, 0])
              .flat()
          ),
          toDimension(tmpDimension),
          options.copy || false
        );
        tmpView = new Uint8Array(context.sharedBuffer!.buffer.slice(0));
      }
      break;
    case CROP_STATE.STOP:
      {
        const width = Math.abs(options.dimension.x);
        const height = Math.abs(options.dimension.y);
        const tmpDimension = context.getTargetDimension(
          ipoint(width, height),
          useToolMeta
        );
        tmpData = invert(tmpData!, toDimension(tmpDimension));
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
  view?: Uint8Array
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
  setPixels(
    context.view!,
    toDimension(context.getDimension()),
    toPoint(ipoint(() => Math.round(targetPosition))),
    tmpData!,
    toDimension(context.getTargetDimension(absDimension, useToolMeta)),
    false
  );
}
