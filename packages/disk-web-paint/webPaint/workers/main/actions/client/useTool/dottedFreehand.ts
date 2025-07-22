import type { IContext, UseToolMeta } from '../../../../../types/worker/main';
import { drawBrush } from '@web-workbench/wasm';
import * as wasm from '../../../../../utils/wasm';
import { ipoint } from '@js-basics/vector';
import type { DottedFreehandOptions } from '@web-workbench/disk-web-paint/webPaint/lib/classes/tool/interaction/DottedFreehand';
import { BRUSH_STATE } from '@web-workbench/disk-web-paint/webPaint/lib/classes/tool/interaction/Brush';

export default function dottedFreehand(
  context: IContext,
  useToolMeta: UseToolMeta,
  options: DottedFreehandOptions
) {
  const currentLayer = context.layerManager.currentLayer;
  const position = context.getTargetPosition(useToolMeta.position, useToolMeta);
  switch (options!.state) {
    case BRUSH_STATE.DRAW:
      currentLayer.removeTmpView();
      draw(
        context,
        useToolMeta,
        options,
        { force: true, hover: false },
        context.layerManager.currentLayer.tmpView
      );
      break;
    case BRUSH_STATE.MOVE:
      if (context.isIntersect(position)) {
        currentLayer.createTmpView();
        draw(
          context,
          useToolMeta,
          options,
          { force: true, hover: true },
          context.layerManager.currentLayer.tmpView
        );
      } else {
        currentLayer.removeTmpView();
      }
      break;
    case BRUSH_STATE.RESET:
      currentLayer.removeTmpView();
      break;
  }
}

function draw(
  context: IContext,
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
    context.layerManager.currentLayer.view.set(view);
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
        context.layerManager.currentLayer.view,
        wasm.toDimension(dimension),
        wasm.toPoint(targetPosition),
        BigInt(useToolMeta.seed ?? 0)
      );
    } else {
      if (drawed < 1) {
        drawed = options.gap ?? 2;
        drawBrush(
          context.layerManager.currentLayer.view,
          wasm.toDimension(dimension),
          wasm.toPoint(targetPosition),
          BigInt(useToolMeta.seed ?? 0)
        );
      } else {
        drawed--;
      }
      lastPosition = targetPosition;
    }
  }
}

let drawed = 0;
