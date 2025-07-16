import type { Context, UseToolMeta } from '../../../../../types/worker/main';
import { drawBrush } from '@web-workbench/wasm';
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
      draw(
        context,
        useToolMeta,
        options,
        { force: true, hover: false },
        context.tmpView
      );
      break;
    case BRUSH_STATE.MOVE:
      if (context.isIntersect(position)) {
        context.createTmpView();
        draw(
          context,
          useToolMeta,
          options,
          { force: true, hover: true },
          context.tmpView
        );
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
  options: DottedFreehandOptions,
  {
    force,
    hover
  }: {
    force: boolean;
    hover: boolean;
  },
  view?: Uint8Array
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

  if (force || !targetPosition.equals(lastPosition)) {
    if (hover) {
      drawBrush(
        context.view!,
        wasm.toDimension(dimension),
        wasm.toPoint(targetPosition)
      );
    } else {
      if (drawed < 1) {
        drawed = options.gap ?? 2;
        drawBrush(
          context.view!,
          wasm.toDimension(dimension),
          wasm.toPoint(targetPosition)
        );
      } else {
        drawed--;
      }
      lastPosition = targetPosition;
    }
  }
}

let drawed = 0;
