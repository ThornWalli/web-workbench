import { ipoint } from '@js-basics/vector';
import {
  ELLIPSE_STATE,
  type EllipseOptions
} from '../../../../../lib/classes/tool/interaction/Ellipse';
import { ellipse as drawEllipse } from '../../../../../lib/utils/paint';
import type { Context, UseToolMeta } from '../../../../../types/main';
import { SHAPE_STYLE } from '@web-workbench/disk-extras13/webPainting/types/select';

let tmpView: Uint8ClampedArray | undefined = undefined;
export default function ellipse(
  context: Context,
  useToolMeta: UseToolMeta,
  options: EllipseOptions
) {
  switch (options.state) {
    case ELLIPSE_STATE.START:
      {
        tmpView = new Uint8ClampedArray(context.sharedBuffer!.buffer.slice(0));
      }
      break;
    case ELLIPSE_STATE.STOP:
      {
        draw(context, useToolMeta, options, tmpView);
        if (tmpView) {
          tmpView = undefined;
        }
      }
      break;
    case ELLIPSE_STATE.MOVE:
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
  options: EllipseOptions,
  view?: Uint8ClampedArray
) {
  const size = context.brush!.getDataSize(true);
  const centerOffset = ipoint(() => -size / 2);

  const dimension = context.getTargetDimension(options.dimension, useToolMeta);

  const offset = ipoint(() => Math.min(dimension, 0));
  let position = context.getTargetPosition(options.position, useToolMeta);
  position = ipoint(() => Math.round(position + centerOffset) + offset);

  const absDimension = ipoint(() => Math.abs(dimension));

  if (!absDimension.x || !absDimension.y) {
    return;
  }

  if (view) {
    context.view?.set(view);
  }

  drawEllipse(
    (x, y, { filled, stroked }) => {
      if (filled) {
        context.setDataRGBA(
          ipoint(Math.round(x), Math.round(y)),
          new Uint8ClampedArray(context.brush!.secondaryColor.toRGBA()),
          ipoint(1, 1)
        );
      }

      if (stroked) {
        const x_ = Math.round(x - size / 2);
        const y_ = Math.round(y - size / 2);
        context.setDataRGBA(
          ipoint(x_, y_),
          context.brush!.data!,
          ipoint(size, size)
        );
      }
    },
    position.x + absDimension.x / 2,
    position.y + absDimension.y / 2,
    Math.round(absDimension.x / 2),
    Math.round(absDimension.y / 2),
    {
      strokeSize: [SHAPE_STYLE.STROKED, SHAPE_STYLE.STROKED_FILLED].includes(
        context.useOptions.tool.shapeStyle || SHAPE_STYLE.STROKED
      )
        ? size
        : 0,
      style: context.useOptions.tool.shapeStyle || SHAPE_STYLE.STROKED,
      segmentLength: context.useOptions.tool.segmentLength || 0,
      gapLength: context.useOptions.tool.gapLength || 0,
      interpolateSegments: context.useOptions.tool.interpolateSegments
    }
  );
}
