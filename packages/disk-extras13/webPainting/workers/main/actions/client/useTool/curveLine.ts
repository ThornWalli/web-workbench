import type { Context, UseToolMeta } from '../../../../../types/main';
import {
  curve as drawCurve,
  line as drawLine
} from '../../../../../lib/utils/paint';
import { ipoint } from '@js-basics/vector';
import type { CurveLineOptions } from '../../../../../lib/classes/tool/CurveLine';
import { GEOMETRY_LINE_STATE } from '../../../../../lib/classes/tool/GeometryLine';

let tmpView: Uint8ClampedArray | undefined = undefined;
export default function straightLine(
  context: Context,
  useToolMeta: UseToolMeta,
  options: CurveLineOptions
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
  options: CurveLineOptions,
  view?: Uint8ClampedArray
) {
  const { position } = useToolMeta;
  if (options.anchorPositions && options.anchorPositions.length > 1) {
    const [primaryAnchor, secondaryAnchor, primaryHelper, secondaryHelper] =
      options.anchorPositions;

    if (options.anchorPositions.length > 1) {
      if (view) {
        context.view?.set(view);
      }

      const size = context.brush!.getDataSize(true);
      const centerOffset = ipoint(() => -size / 2);
      // #region primary position
      let primaryPosition = context.getTargetPosition(
        primaryAnchor,
        useToolMeta
      );
      primaryPosition = ipoint(() =>
        Math.round(primaryPosition + centerOffset)
      );
      // #endregion
      // #region secondary position
      let secondaryPosition = context.getTargetPosition(
        secondaryAnchor || position,
        useToolMeta
      );
      secondaryPosition = ipoint(() =>
        Math.round(secondaryPosition + centerOffset)
      );
      // #endregion
      // #region primary helper position
      let primaryHelperPosition = context.getTargetPosition(
        primaryHelper,
        useToolMeta
      );
      primaryHelperPosition = ipoint(() =>
        Math.round(primaryHelperPosition + centerOffset)
      );
      // #endregion
      // #region secondary helper position
      let secondaryHelperPosition = context.getTargetPosition(
        secondaryHelper,
        useToolMeta
      );
      secondaryHelperPosition = ipoint(() =>
        Math.round(secondaryHelperPosition + centerOffset)
      );
      // #endregion
      if (options.anchorPositions.length > 2) {
        drawCurve(
          (x: number, y: number) => {
            context.setDataRGBA(
              ipoint(Math.round(x), Math.round(y)),
              context.brush!.data,
              context.brush!.getDataSize(true)
            );
          },
          primaryPosition.x,
          primaryPosition.y,
          primaryHelperPosition.x,
          primaryHelperPosition.y,
          secondaryHelperPosition.x,
          secondaryHelperPosition.y,
          secondaryPosition.x,
          secondaryPosition.y
        );
      } else {
        drawLine(
          (x: number, y: number) => {
            context.setDataRGBA(
              ipoint(Math.round(x), Math.round(y)),
              context.brush!.data,
              context.brush!.getDataSize(true)
            );
          },
          primaryPosition.x,
          primaryPosition.y,
          secondaryPosition.x,
          secondaryPosition.y
        );
      }
    }
  }
}
