import type { Context, UseToolMeta } from '../../../../../types/main';
import { drawBrush } from '@web-workbench/wasm/pkg/wasm';
import * as wasm from '../../../../../utils/wasm';
import { ipoint } from '@js-basics/vector';

export default function dottedFreehand(
  context: Context,
  useToolMeta: UseToolMeta
) {
  let targetPosition = context.getTargetPosition(
    useToolMeta.position,
    useToolMeta
  );

  targetPosition = ipoint(() =>
    Math.round(targetPosition - context.useOptions.brush.size / 2)
  );

  const dimension = context.getDimension();

  drawBrush(
    context.viewTest!,
    wasm.toDimension(dimension),
    wasm.toPoint(targetPosition)
  );
}
