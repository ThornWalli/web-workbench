/* eslint-disable complexity */

import type { IContext, UseToolMeta } from '../../../../../types/worker/main';
import { ipoint } from '@js-basics/vector';
import type { CurveLineOptions } from '../../../../../lib/classes/tool/interaction/CurveLine';
import { GEOMETRY_LINE_STATE } from '../../../../../lib/classes/tool/interaction/GeometryLine';
import { drawBezier, drawLine } from '@web-workbench/wasm';
import * as wasm from '../../../../../utils/wasm';

export default function straightLine(
  context: IContext,
  useToolMeta: UseToolMeta,
  options: CurveLineOptions
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
  context: IContext,
  useToolMeta: UseToolMeta,
  options: CurveLineOptions,
  view?: Uint8Array
) {
  const { position } = useToolMeta;
  if (options.anchorPositions && options.anchorPositions.length > 1) {
    const [primaryAnchor, secondaryAnchor, primaryHelper, secondaryHelper] =
      options.anchorPositions;

    if (options.anchorPositions.length > 1) {
      if (view) {
        context.view?.set(view);
      }

      const size = context.brushDescription!.getSize();
      const centerOffset = ipoint(-size / 2, -size / 2);

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
        drawBezier(
          context.view!,
          wasm.toDimension(context.getDimension()),
          wasm.toPoint(primaryPosition),
          wasm.toPoint(primaryHelperPosition),
          wasm.toPoint(secondaryPosition),
          wasm.toPoint(secondaryHelperPosition),
          wasm.toBezierOptions({
            segmentLength: context.useOptions.tool.segmentLength || 1,
            gapLength: context.useOptions.tool.gapLength || 0,
            interpolateSegments:
              context.useOptions.tool.interpolateSegments || false,
            seed: useToolMeta.seed
          })
        );
      } else {
        drawLine(
          context.view!,
          wasm.toDimension(context.getDimension()),
          wasm.toPoint(primaryPosition),
          wasm.toPoint(secondaryPosition),
          wasm.toLineOptions({
            segmentLength: context.useOptions.tool.segmentLength || 1,
            gapLength: context.useOptions.tool.gapLength || 0,
            seed: useToolMeta.seed
          })
        );
      }
    }
  }
}
