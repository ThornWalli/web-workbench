import type { StraightLineOptions } from '../../../../../lib/classes/tool/interaction/StraightLine';
import type { IContext, UseToolMeta } from '../../../../../types/worker/main';
import { GEOMETRY_LINE_STATE } from '../../../../../lib/classes/tool/interaction/GeometryLine';
import * as wasm from '../../../../../utils/wasm';
import { ipoint } from '@js-basics/vector';
import { drawLine } from '@web-workbench/wasm';

export default function straightLine(
  context: IContext,
  useToolMeta: UseToolMeta,
  options: StraightLineOptions
) {
  switch (options.state) {
    case GEOMETRY_LINE_STATE.START:
      {
        context.layerManager.currentLayer.createTmpView();
      }
      break;
    case GEOMETRY_LINE_STATE.STOP:
      {
        context.layerManager.currentLayer.removeTmpView();
        draw(context, useToolMeta, options);
      }
      break;
    case GEOMETRY_LINE_STATE.MOVE:
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
  }
}

function draw(
  context: IContext,
  useToolMeta: UseToolMeta,
  options: StraightLineOptions,
  view?: Uint8Array
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
      context.layerManager.currentLayer.view.set(view);
    }

    drawLine(
      context.layerManager.currentLayer.view,
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
