import type { Context, UseToolMeta } from '../../../../../types/main';
import { GEOMETRY_LINE_STATE } from '../../../../../lib/classes/tool/interaction/GeometryLine';
import type { PolygonOptions } from '../../../../../lib/classes/tool/interaction/Polygon';
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import { SHAPE_STYLE } from '@web-workbench/disk-extras13/webPaint/types/select';
import { drawPolygon } from '@web-workbench/wasm/pkg/wasm';
import {
  toDimension,
  toPoint,
  toPolygonOptions
} from '@web-workbench/disk-extras13/webPaint/utils/wasm';

let tmpView: Uint8ClampedArray | undefined = undefined;
export default function polygon(
  context: Context,
  useToolMeta: UseToolMeta,
  options: PolygonOptions
) {
  switch (options.state) {
    case GEOMETRY_LINE_STATE.START:
      {
        tmpView = new Uint8ClampedArray(context.sharedBuffer!.buffer.slice(0));
      }
      break;
    case GEOMETRY_LINE_STATE.STOP:
      {
        if (tmpView) {
          tmpView = undefined;
        }
        draw(context, useToolMeta, options);
      }
      break;
    case GEOMETRY_LINE_STATE.MOVE:
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
  options: PolygonOptions,
  view?: Uint8ClampedArray
) {
  if (options.anchorPositions && options.anchorPositions.length > 1) {
    const centerOffset = ipoint(0, 0);

    const getAnchorPosition = (anchor: IPoint & number) => {
      const position = context.getTargetPosition(anchor, useToolMeta);
      return ipoint(() => Math.round(position + centerOffset));
    };

    if (view) {
      context.view?.set(view);
    }
    drawPolygon(
      context.viewTest!,
      toDimension(context.getDimension()),
      options.anchorPositions.map(getAnchorPosition).map(toPoint),
      toPolygonOptions({
        style: context.useOptions.tool.shapeStyle || SHAPE_STYLE.STROKED,
        segmentLength: context.useOptions.tool.segmentLength || 0,
        gapLength: context.useOptions.tool.gapLength || 0
      })
    );
  }
}
