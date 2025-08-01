import { ipoint } from '@js-basics/vector';
import type { RectangleOptions } from '../../../../../lib/classes/tool/interaction/Rectangle';
import type { IContext, UseToolMeta } from '../../../../../types/worker/main';
import { drawRectangle } from '@web-workbench/wasm';
import * as wasm from '../../../../../utils/wasm';
import { SHAPE_STYLE } from '@web-workbench/disk-web-paint/webPaint/types/select';
import { PLACEMENT_STATE } from '@web-workbench/disk-web-paint/webPaint/lib/classes/tool/PlacementTool';

export enum STROKE_ALIGN {
  CENTER,
  INSIDE,
  OUTSIDE
}

export default function rectangle(
  context: IContext,
  useToolMeta: UseToolMeta,
  options: RectangleOptions
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
  options: RectangleOptions,
  view?: Uint8Array
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

  if (view) {
    context.layerManager.currentLayer.view.set(view);
  }

  position = ipoint(() => Math.round(position + offset));

  drawRectangle(
    context.layerManager.currentLayer.view,
    wasm.toDimension(context.getDimension()),
    wasm.toPoint(position),
    wasm.toDimension(ipoint(() => Math.abs(dimension))),
    wasm.toRectangleOptions({
      style,
      strokeAlign: STROKE_ALIGN.OUTSIDE,
      fillColor: context.useOptions.color.secondaryColor.color,
      segmentLength: context.useOptions.tool.segmentLength || 0,
      gapLength: context.useOptions.tool.gapLength || 0,
      seed: useToolMeta.seed
    })
  );
}
