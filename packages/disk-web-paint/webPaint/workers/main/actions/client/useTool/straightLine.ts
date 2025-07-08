import type { StraightLineOptions } from '../../../../../lib/classes/tool/interaction/StraightLine';
import type { Context, UseToolMeta } from '../../../../../types/main';
import { GEOMETRY_LINE_STATE } from '../../../../../lib/classes/tool/interaction/GeometryLine';
import * as wasm from '../../../../../utils/wasm';
import { ipoint } from '@js-basics/vector';
import { drawLine } from '@web-workbench/wasm/pkg/wasm';

let tmpView: Uint8ClampedArray | undefined = undefined;
export default function straightLine(
  context: Context,
  useToolMeta: UseToolMeta,
  options: StraightLineOptions
) {
  switch (options.state) {
    case GEOMETRY_LINE_STATE.START:
      {
        tmpView = new Uint8ClampedArray(context.sharedBuffer!.buffer.slice(0));
        console.log('GEOMETRY_LINE_STATE.START');
      }
      break;
    case GEOMETRY_LINE_STATE.STOP:
      {
        if (tmpView) {
          tmpView = undefined;
        }
        draw(context, useToolMeta, options);
        console.log('GEOMETRY_LINE_STATE.STOP');
      }
      break;
    case GEOMETRY_LINE_STATE.MOVE:
      {
        if (tmpView) {
          draw(context, useToolMeta, options, tmpView);
        }
        console.log('GEOMETRY_LINE_STATE.MOVE');
      }
      break;
  }
}

function draw(
  context: Context,
  useToolMeta: UseToolMeta,
  options: StraightLineOptions,
  view?: Uint8ClampedArray
) {
  const { position } = useToolMeta;
  if (options.anchorPositions && options.anchorPositions.length > 1) {
    const [primaryAnchor, secondaryAnchor] = options.anchorPositions;

    const size = context.brushDescription!.getSize();
    const centerOffset = ipoint(-size / 2, -size / 2);

    // #region primary position
    let primaryPosition = context.getTargetPosition(primaryAnchor, useToolMeta);
    primaryPosition = ipoint(() => Math.round(primaryPosition + centerOffset));
    // #endregion
    // #region secondary position
    let secondaryPosition = context.getTargetPosition(
      secondaryAnchor || position,
      useToolMeta
    );
    secondaryPosition = ipoint(() =>
      Math.round(secondaryPosition + centerOffset)
    );
    // endregion

    if (view) {
      context.view?.set(view);
    }

    drawLine(
      context.viewTest!,
      wasm.toDimension(context.getDimension()),
      wasm.toPoint(primaryPosition),
      wasm.toPoint(secondaryPosition),
      wasm.toLineOptions({
        segmentLength: context.useOptions.tool.segmentLength || 1,
        gapLength: context.useOptions.tool.gapLength || 0
      })
    );
  }
}
