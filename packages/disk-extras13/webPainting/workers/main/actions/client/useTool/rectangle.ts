import { ipoint } from '@js-basics/vector';
import {
  RECTANGLE_STATE,
  type RectangleOptions
} from '../../../../../lib/classes/tool/Rectangle';
import {
  rectangle as drawRectangle,
  STROKE_ALIGN
} from '../../../../../lib/utils/paint';
import type { Context, UseToolMeta } from '../../../../../types/main';

let tmpView: Uint8ClampedArray | undefined = undefined;
export default function rectangle(
  context: Context,
  useToolMeta: UseToolMeta,
  options: RectangleOptions
) {
  switch (options.state) {
    case RECTANGLE_STATE.START:
      {
        tmpView = new Uint8ClampedArray(context.sharedBuffer!.buffer.slice(0));
      }
      break;
    case RECTANGLE_STATE.STOP:
      {
        draw(context, useToolMeta, options, tmpView);
        if (tmpView) {
          tmpView = undefined;
        }
      }
      break;
    case RECTANGLE_STATE.MOVE:
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
  options: RectangleOptions,
  view?: Uint8ClampedArray
) {
  const size = context.brush!.getDataSize(true);
  const centerOffset = ipoint(() => -size / 2);

  let position = context.getTargetPosition(options.position, useToolMeta);
  position = ipoint(() => Math.round(position + centerOffset));

  const dimension = context.getTargetDimension(options.dimension, useToolMeta);

  if (view) {
    context.view?.set(view);
  }

  const offset = ipoint(() => Math.min(dimension, 0));
  position = ipoint(() => Math.round(position + offset));

  drawRectangle(
    (
      x: number,
      y: number,
      filled?: boolean,
      width?: number,
      height?: number
    ) => {
      if (filled && width !== undefined && height !== undefined) {
        const data = new Uint8ClampedArray(
          Array(width * height)
            .fill(context.useOptions.color.secondaryColor.toRGBA())
            .flat()
        );
        context.setDataRGBA(ipoint(x, y), data, ipoint(width, height));
      } else {
        context.setDataRGBA(
          ipoint(() => Math.round(ipoint(x, y))),
          context.brush!.data!,
          size
        );
      }
    },
    position.x,
    position.y,
    dimension.x,
    dimension.y,
    {
      strokeAlign: STROKE_ALIGN.CENTER,
      strokeSize: size.x,
      filled: options.filled
    }
  );
}
