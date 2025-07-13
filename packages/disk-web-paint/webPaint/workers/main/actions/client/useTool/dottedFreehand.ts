import type { Context, UseToolMeta } from '../../../../../types/worker/main';
import { drawBrush } from '@web-workbench/wasm/pkg/wasm';
import * as wasm from '../../../../../utils/wasm';
import { ipoint } from '@js-basics/vector';
import type { DottedFreehandOptions } from '@web-workbench/disk-web-paint/webPaint/lib/classes/tool/interaction/DottedFreehand';
import { BRUSH_STATE } from '@web-workbench/disk-web-paint/webPaint/lib/classes/tool/interaction/Brush';

export default function dottedFreehand(
  context: Context,
  useToolMeta: UseToolMeta,
  options: DottedFreehandOptions
) {
  const position = context.getTargetPosition(useToolMeta.position, useToolMeta);
  switch (options!.state) {
    case BRUSH_STATE.DRAW:
      context.removeTmpView();
      draw(context, useToolMeta, options, context.tmpView, true);
      break;
    case BRUSH_STATE.MOVE:
      if (context.isIntersect(position)) {
        context.createTmpView();
        draw(context, useToolMeta, options, context.tmpView, true);
      } else {
        context.removeTmpView();
      }
      break;
  }
}

function draw(
  context: Context,
  useToolMeta: UseToolMeta,
  options: DottedFreehandOptions,
  view?: Uint8Array,
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
    drawBrush(
      context.view!,
      wasm.toDimension(dimension),
      wasm.toPoint(targetPosition)
    );
    lastPosition = targetPosition;
  }
}
