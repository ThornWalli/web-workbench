import { ipoint } from '@js-basics/vector';

import type { EllipseOptions } from '../../../../../lib/classes/tool/interaction/Ellipse';
import type { IContext, UseToolMeta } from '../../../../../types/worker/main';
import { SHAPE_STYLE } from '@web-workbench/disk-web-paint/webPaint/types/select';
import { drawEllipse } from '@web-workbench/wasm';
import * as wasm from '../../../../../utils/wasm';
import { PLACEMENT_STATE } from '@web-workbench/disk-web-paint/webPaint/lib/classes/tool/PlacementTool';

export default function ellipse(
  context: IContext,
  useToolMeta: UseToolMeta,
  options: EllipseOptions
) {
  switch (options.state) {
    case PLACEMENT_STATE.START:
      {
        context.layerManager.currentLayer.createTmpView();
      }
      break;
    case PLACEMENT_STATE.STOP:
      {
        context.layerManager.currentLayer.removeTmpView();
        draw(context, useToolMeta, options);
      }
      break;
    case PLACEMENT_STATE.MOVE:
      {
        if (context.layerManager.currentLayer.tmpView) {
          draw(
            context,
            useToolMeta,
            options,
            context.layerManager.currentLayer.tmpView
          );
        }
      }
      break;
    case PLACEMENT_STATE.ABORT:
      {
        context.layerManager.currentLayer.removeTmpView();
      }
      break;
  }
}

function draw(
  context: IContext,
  useToolMeta: UseToolMeta,
  options: EllipseOptions,
  view?: Uint8Array
) {
  const style = context.useOptions.tool.shapeStyle || SHAPE_STYLE.STROKED;

  const size = context.brushDescription!.getScaledSize(true);
  const dimension = context.getTargetDimension(options.dimension, useToolMeta);
  const offset = ipoint(() => Math.min(dimension, 0));
  const isNeg = ipoint(() => Math.sign(offset));

  const centerOffset = ipoint(() => -size * isNeg);

  let position = context.getTargetPosition(options.position, useToolMeta, {
    round: true
  });
  if (style !== SHAPE_STYLE.FILLED) {
    position = ipoint(() => Math.round(position + centerOffset));
  }

  position = ipoint(() => Math.round(position + offset));

  const absDimension = ipoint(() => Math.abs(dimension));

  if (!absDimension.x || !absDimension.y) {
    return;
  }

  if (view) {
    context.layerManager.currentLayer.view.set(view);
  }

  drawEllipse(
    context.layerManager.currentLayer.view,
    wasm.toDimension(context.getDimension()),
    wasm.toPoint(position),
    wasm.toDimension(absDimension),
    wasm.toEllipseOptions({
      style,
      fillColor: context.brushDescription!.secondaryColor,
      segmentLength: context.useOptions.tool.segmentLength || 0,
      gapLength: context.useOptions.tool.gapLength || 0,
      interpolateSegments: context.useOptions.tool.interpolateSegments,
      seed: useToolMeta.seed
    })
  );
}
