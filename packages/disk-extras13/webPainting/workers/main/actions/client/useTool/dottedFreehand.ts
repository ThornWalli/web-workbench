import { ipoint } from '@js-basics/vector';
import type { Context, UseToolMeta } from '../../../../../types/main';

export default function dottedFreehand(
  context: Context,
  useToolMeta: UseToolMeta
) {
  const targetPosition = context.getTargetPosition(
    useToolMeta.position,
    useToolMeta
  );
  const brushSize = context.brush!.getDataSize(true);

  context.setDataRGBA(
    ipoint(() => Math.round(targetPosition - brushSize / 2)),
    context.brush!.data,
    brushSize
  );
}
