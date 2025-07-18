import { ipoint } from '@js-basics/vector';
import type { Context, UseToolMeta } from '../../../../../types/worker/main';
import { CROP_STATE } from '@web-workbench/disk-web-paint/webPaint/lib/classes/tool/interaction/Crop';
import type { CropOptions } from '@web-workbench/disk-web-paint/webPaint/lib/classes/tool/interaction/Crop';
import { getPixels, invert, setPixels } from '@web-workbench/wasm';
import {
  toBrushMode,
  toDimension,
  toPoint
} from '@web-workbench/disk-web-paint/webPaint/utils/wasm';
import { BRUSH_MODE } from '@web-workbench/disk-web-paint/webPaint/types/select';

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
        const _position = ipoint(() => position + offset);
        const width = Math.abs(dimension.x);
        const height = Math.abs(dimension.y);
        const tmpDimension = context.getTargetDimension(
          ipoint(width, height),
          useToolMeta
        );

        // Get pixels from the current view
        tmpData = getPixels(
          context.view!,
          toDimension(context.getDimension()),
          toPoint(context.getTargetPosition(_position, useToolMeta)),
          toDimension(tmpDimension)
        );
        // Invert the pixels to prepare for cropping
        invert(tmpData, toDimension(tmpDimension));

        // optionally replace pixels in the current view
        if (options.cut) {
          setPixels(
            context.view!,
            toDimension(context.getDimension()),
            toPoint(context.getTargetPosition(_position, useToolMeta)),
            new Uint8Array(
              Array(tmpData.length / 4)
                .fill([0, 0, 0, 0])
                .flat()
            ),
            toDimension(tmpDimension),
            toBrushMode(BRUSH_MODE.REPLACE)
          );
        }
        context.createTmpView();
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
        invert(tmpData!, toDimension(tmpDimension));
        context.removeTmpView();
        draw(context, useToolMeta, options, tmpData!);
        tmpData = undefined;
      }
      break;
    case CROP_STATE.ABORT:
      {
        context.removeTmpView();
        tmpData = undefined;
      }
      break;
    case CROP_STATE.MOVE:
      {
        if (tmpData) {
          draw(context, useToolMeta, options, tmpData, context.tmpView);
        }
      }
      break;
  }
}

function draw(
  context: Context,
  useToolMeta: UseToolMeta,
  options: CropOptions,
  partialView: Uint8Array,
  view?: Uint8Array
) {
  if (view && context.view) {
    context.view.set(view);
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
    partialView,
    toDimension(context.getTargetDimension(absDimension, useToolMeta)),
    toBrushMode(BRUSH_MODE.NORMAL)
  );
}
