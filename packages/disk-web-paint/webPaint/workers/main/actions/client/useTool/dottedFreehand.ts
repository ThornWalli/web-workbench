import type { Context, UseToolMeta } from '../../../../../types/main';
import { drawBrush } from '@web-workbench/wasm/pkg/wasm';
import * as wasm from '../../../../../utils/wasm';

export default function dottedFreehand(
  context: Context,
  useToolMeta: UseToolMeta
) {
  const targetPosition = context.getTargetPosition(
    useToolMeta.position,
    useToolMeta
  );
  const dimension = context.getDimension();

  drawBrush(
    context.viewTest!,
    wasm.toDimension(dimension),
    wasm.toPoint(targetPosition)
  );
}
