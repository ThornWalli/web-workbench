import { ipoint } from '@js-basics/vector';
import { ELLIPSE_STATE } from '../../../../../lib/classes/tool/interaction/Ellipse';
import type { EllipseOptions } from '../../../../../lib/classes/tool/interaction/Ellipse';
import type { Context, UseToolMeta } from '../../../../../types/main';
import { SHAPE_STYLE } from '@web-workbench/disk-web-paint/webPaint/types/select';
import { drawEllipse } from '@web-workbench/wasm/pkg/wasm';
import * as wasm from '../../../../../utils/wasm';

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
  const style = context.useOptions.tool.shapeStyle || SHAPE_STYLE.STROKED;

  const size = context.brushDescription!.getScaledSize(true);
  const dimension = context.getTargetDimension(options.dimension, useToolMeta);
  const offset = ipoint(() => Math.min(dimension, 0));
  const isNeg = ipoint(() => Math.sign(offset));

  const centerOffset = ipoint(() => -size * isNeg);

  let position = context.getTargetPosition(options.position, useToolMeta);
  if (style !== SHAPE_STYLE.FILLED) {
    position = ipoint(() => Math.round(position + centerOffset));
  }

  position = ipoint(() => Math.round(position + offset));

  const absDimension = ipoint(() => Math.abs(dimension));

  if (!absDimension.x || !absDimension.y) {
    return;
  }

  if (view) {
    context.view?.set(view);
  }

  drawEllipse(
    context.view!,
    wasm.toDimension(context.getDimension()),
    wasm.toPoint(position),
    wasm.toDimension(absDimension),
    wasm.toEllipseOptions({
      style,
      fillColor: context.brushDescription!.secondaryColor,
      segmentLength: context.useOptions.tool.segmentLength || 0,
      gapLength: context.useOptions.tool.gapLength || 0,
      interpolateSegments: context.useOptions.tool.interpolateSegments
    })
  );
}
