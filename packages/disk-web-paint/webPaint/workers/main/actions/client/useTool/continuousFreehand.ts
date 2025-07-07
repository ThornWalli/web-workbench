import { ipoint } from '@js-basics/vector';
import type { ContinuousFreehandOptions } from '../../../../../lib/classes/tool/interaction/ContinuousFreehand';
import type { Context, UseToolMeta } from '../../../../../types/main';
import * as wasm from '../../../../../utils/wasm';
import { drawLine } from '@web-workbench/wasm/pkg/wasm';

export default function continuousFreehand(
  context: Context,
  useToolMeta: UseToolMeta,
  options: ContinuousFreehandOptions
) {
  let targetPosition = context.getTargetPosition(
    useToolMeta.position,
    useToolMeta
  );

  targetPosition = ipoint(() =>
    Math.round(targetPosition - context.useOptions.brush.size / 2)
  );

  let lastPosition = context.getTargetPosition(options.lastPosition, {
    ...useToolMeta
  });
  lastPosition = ipoint(() =>
    Math.round(lastPosition - context.useOptions.brush.size / 2)
  );

  const dimension = context.getDimension();
  drawLine(
    context.viewTest!,
    wasm.toDimension(dimension),
    wasm.toPoint(lastPosition),
    wasm.toPoint(targetPosition),
    wasm.toLineOptions({
      segmentLength: context.useOptions.tool.segmentLength,
      gapLength: context.useOptions.tool.gapLength
    })
  );
}
