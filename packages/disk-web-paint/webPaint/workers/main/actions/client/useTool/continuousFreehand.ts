import { ipoint } from '@js-basics/vector';
import type { ContinuousFreehandOptions } from '../../../../../lib/classes/tool/interaction/ContinuousFreehand';
import type { Context, UseToolMeta } from '../../../../../types/worker/main';
import * as wasm from '../../../../../utils/wasm';
import { drawBrush, drawLine } from '@web-workbench/wasm/pkg/wasm';
import { BRUSH_STATE } from '@web-workbench/disk-web-paint/webPaint/lib/classes/tool/interaction/Brush';

export default function continuousFreehand(
  context: Context,
  useToolMeta: UseToolMeta,
  options: ContinuousFreehandOptions
) {
  const position = context.getTargetPosition(useToolMeta.position, useToolMeta);
  switch (options!.state) {
    case BRUSH_STATE.DRAW:
      context.removeTmpView();
      draw(context, useToolMeta, options, undefined, false, true);
      break;
    case BRUSH_STATE.MOVE:
      if (context.isIntersect(position)) {
        context.createTmpView();
        draw(context, useToolMeta, options, context.tmpView, true, true);
      } else {
        context.removeTmpView();
      }
      break;
    case BRUSH_STATE.RESET:
      context.removeTmpView();
      break;
  }
}

function draw(
  context: Context,
  useToolMeta: UseToolMeta,
  options: ContinuousFreehandOptions,
  view?: Uint8Array,
  tmp: boolean = false,
  force: boolean = false
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
  let lastPosition = context.getTargetPosition(options.lastPosition!, {
    ...useToolMeta
  });
  lastPosition = ipoint(() =>
    Math.round(lastPosition - context.useOptions.brush.size / 2)
  );

  if (force || !targetPosition.equals(lastPosition)) {
    if (tmp) {
      drawBrush(
        context.view!,
        wasm.toDimension(dimension),
        wasm.toPoint(targetPosition)
      );
    } else {
      drawLine(
        context.view!,
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
}
