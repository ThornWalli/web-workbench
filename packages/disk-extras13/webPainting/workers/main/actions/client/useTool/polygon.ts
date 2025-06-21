import type { Context, UseToolMeta } from '../../../../../types/main';
import { polygon as drawPolygon } from '../../../../../lib/utils/paint';
import { GEOMETRY_LINE_STATE } from '../../../../../lib/classes/tool/GeometryLine';
import type { PolygonOptions } from '../../../../..//lib/classes/tool/Polygon';
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';

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
    const size = context.brush!.getDataSize(true);
    const centerOffset = ipoint(() => -size / 2);

    const getAnchorPosition = (anchor: IPoint & number) => {
      const position = context.getTargetPosition(anchor, useToolMeta);
      return ipoint(() => Math.round(position + centerOffset));
    };

    if (view) {
      context.view?.set(view);
    }
    drawPolygon(
      (x: number, y: number) => {
        context.setDataRGBA(
          ipoint(Math.round(x), Math.round(y)),
          context.brush!.data,
          context.brush!.getDataSize(true)
        );
      },
      options.anchorPositions.map(getAnchorPosition),
      true,
      {
        filled: options.filled || false
      }
    );
  }
}
