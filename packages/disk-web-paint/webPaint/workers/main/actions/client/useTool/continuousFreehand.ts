import { ipoint } from '@js-basics/vector';
import type { ContinuousFreehandOptions } from '../../../../../lib/classes/tool/interaction/ContinuousFreehand';
import type { IContext, UseToolMeta } from '../../../../../types/worker/main';
import * as wasm from '../../../../../utils/wasm';
import { drawBrush, drawLine } from '@web-workbench/wasm';
import { BRUSH_STATE } from '@web-workbench/disk-web-paint/webPaint/lib/classes/tool/interaction/Brush';

export default function continuousFreehand(
  context: IContext,
  useToolMeta: UseToolMeta,
  options: ContinuousFreehandOptions
) {
  const currentLayer = context.layerManager.currentLayer;
  const position = context.getTargetPosition(useToolMeta.position, useToolMeta);
  switch (options!.state) {
    case BRUSH_STATE.DRAW:
      currentLayer.removeTmpView();
      draw(context, useToolMeta, options, undefined, false, true);
      break;
    case BRUSH_STATE.MOVE:
      if (context.isIntersect(position)) {
        currentLayer.createTmpView();
        draw(context, useToolMeta, options, currentLayer.tmpView!, true, true);
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
  options: ContinuousFreehandOptions,
  view?: Uint8Array,
  tmp: boolean = false,
  force: boolean = false
) {
  const layerView = context.layerManager.currentLayer.view;
  if (view) {
    layerView.set(view);
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
        layerView,
        wasm.toDimension(dimension),
        wasm.toPoint(targetPosition),
        BigInt(useToolMeta.seed ?? 0)
      );
    } else {
      drawLine(
        layerView,
        wasm.toDimension(dimension),
        wasm.toPoint(lastPosition),
        wasm.toPoint(targetPosition),
        wasm.toLineOptions({
          segmentLength: context.useOptions.tool.segmentLength,
          gapLength: context.useOptions.tool.gapLength,
          seed: useToolMeta.seed
        })
      );
    }
  }
}
