import { ipoint } from '@js-basics/vector';
import type { ContinuousFreehandOptions } from '../../../../../lib/classes/tool/interaction/ContinuousFreehand';
import type { Context, UseToolMeta } from '../../../../../types/main';
import * as wasm from '../../../../../utils/wasm';
import { drawBrush, drawLine } from '@web-workbench/wasm/pkg/wasm';
import { BRUSH_STATE } from '@web-workbench/disk-web-paint/webPaint/lib/classes/tool/interaction/Brush';

let tmpView: Uint8ClampedArray | undefined = undefined;
export default function continuousFreehand(
  context: Context,
  useToolMeta: UseToolMeta,
  options: ContinuousFreehandOptions
) {
  const position = context.getTargetPosition(useToolMeta.position, useToolMeta);
  switch (options!.state) {
    case BRUSH_STATE.DRAW:
      tmpView = undefined;
      draw(context, useToolMeta, options, tmpView, false);
      tmpView = new Uint8ClampedArray(context.sharedBuffer!.buffer.slice(0));
      break;
    case BRUSH_STATE.MOVE:
      if (context.isIntersect(position)) {
        tmpView =
          tmpView ||
          new Uint8ClampedArray(context.sharedBuffer!.buffer.slice(0));
        draw(context, useToolMeta, options, tmpView, true);
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
  options: ContinuousFreehandOptions,
  view?: Uint8ClampedArray,
  tmp: boolean = false
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
  if (tmp) {
    drawBrush(
      context.viewTest!,
      wasm.toDimension(dimension),
      wasm.toPoint(targetPosition)
    );
  } else {
    let lastPosition = context.getTargetPosition(options.lastPosition, {
      ...useToolMeta
    });
    lastPosition = ipoint(() =>
      Math.round(lastPosition - context.useOptions.brush.size / 2)
    );

    drawLine(
      context.viewTest!,
      wasm.toDimension(dimension),
      wasm.toPoint(lastPosition),
      wasm.toPoint(targetPosition),
      wasm.toLineOptions({
        segmentLength: context.useOptions.tool.segmentLength,
        gapLength: context.useOptions.tool.gapLength
      })
    );
  }
}
