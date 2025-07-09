import type { Context, UseToolMeta } from '../../../../../types/main';
import { drawBrush } from '@web-workbench/wasm/pkg/wasm';
import * as wasm from '../../../../../utils/wasm';
import { ipoint } from '@js-basics/vector';
import type { DottedFreehandOptions } from '@web-workbench/disk-web-paint/webPaint/lib/classes/tool/interaction/DottedFreehand';
import { BRUSH_STATE } from '@web-workbench/disk-web-paint/webPaint/lib/classes/tool/interaction/Brush';

let tmpView: Uint8ClampedArray | undefined = undefined;
export default function dottedFreehand(
  context: Context,
  useToolMeta: UseToolMeta,
  options: DottedFreehandOptions
) {
  const position = context.getTargetPosition(useToolMeta.position, useToolMeta);
  switch (options!.state) {
    case BRUSH_STATE.DRAW:
      tmpView = undefined;
      draw(context, useToolMeta, tmpView);
      tmpView = new Uint8ClampedArray(context.sharedBuffer!.buffer.slice(0));
      break;
    case BRUSH_STATE.MOVE:
      if (context.isIntersect(position)) {
        tmpView =
          tmpView ||
          new Uint8ClampedArray(context.sharedBuffer!.buffer.slice(0));
        draw(context, useToolMeta, tmpView);
      } else {
        context.view?.set(tmpView || new Uint8ClampedArray());
        tmpView = undefined;
      }
      break;
  }
}

function draw(
  context: Context,
  useToolMeta: UseToolMeta,
  view?: Uint8ClampedArray
) {
  if (view) {
    context.view?.set(view);
  }

  let targetPosition = context.getTargetPosition(
    useToolMeta.position,
    useToolMeta
  );

  targetPosition = ipoint(() =>
    Math.round(targetPosition - context.useOptions.brush.size / 2)
  );

  const dimension = context.getDimension();

  drawBrush(
    context.view!,
    wasm.toDimension(dimension),
    wasm.toPoint(targetPosition)
  );
}
