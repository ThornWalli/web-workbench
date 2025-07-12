import type { Context, UseToolMeta } from '../../../../../types/worker/main';
import { GEOMETRY_LINE_STATE } from '../../../../../lib/classes/tool/interaction/GeometryLine';
import type { PolygonOptions } from '../../../../../lib/classes/tool/interaction/Polygon';
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import { SHAPE_STYLE } from '@web-workbench/disk-web-paint/webPaint/types/select';
import { drawPolygon } from '@web-workbench/wasm/pkg/wasm';
import {
  toDimension,
  toPoint,
  toPolygonOptions
} from '@web-workbench/disk-web-paint/webPaint/utils/wasm';

export default function polygon(
  context: Context,
  useToolMeta: UseToolMeta,
  options: PolygonOptions
) {
  switch (options.state) {
    case GEOMETRY_LINE_STATE.START:
      {
        context.createTmpView();
      }
      break;
    case GEOMETRY_LINE_STATE.STOP:
      {
        context.removeTmpView();
        draw(context, useToolMeta, options);
      }
      break;
    case GEOMETRY_LINE_STATE.MOVE:
      {
        if (context.tmpView) {
          draw(context, useToolMeta, options, context.tmpView);
        }
      }
      break;
  }
}

function draw(
  context: Context,
  useToolMeta: UseToolMeta,
  options: PolygonOptions,
  view?: Uint8Array
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
      context.view!,
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
