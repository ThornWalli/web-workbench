import { ipoint } from '@js-basics/vector';
import {
  RECTANGLE_STATE,
  type RectangleOptions
} from '../../../../../lib/classes/tool/interaction/Rectangle';
import type { Context, UseToolMeta } from '../../../../../types/main';
import { drawRectangle } from '@web-workbench/wasm';
import * as wasm from '../../../../../utils/wasm';

import {
  SHAPE_STYLE,
  STROKE_ALIGN
} from '@web-workbench/disk-extras13/webPaint/types/select';

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
  const size = context.brushDescription!.getScaledSize(true);
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
    context.viewTest!,
    wasm.toDimension(context.getDimension()),
    wasm.toPoint(position),
    wasm.toDimension(ipoint(() => Math.abs(dimension))),
    wasm.toRectangleOptions({
      style: context.useOptions.tool.shapeStyle || SHAPE_STYLE.STROKED,
      strokeAlign: STROKE_ALIGN.CENTER,
      fillColor: context.useOptions.color.secondaryColor.color,
      segmentLength: context.useOptions.tool.segmentLength || 0,
      gapLength: context.useOptions.tool.gapLength || 0
    })
  );
}
