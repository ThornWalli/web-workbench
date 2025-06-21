import { ipoint } from '@js-basics/vector';
import type { ContinuousFreehandOptions } from '../../../../../lib/classes/tool/ContinuousFreehand';
import { line as drawLine } from '../../../../../lib/utils/paint';
import type { Context, UseToolMeta } from '../../../../../types/main';

export default function continuousFreehand(
  context: Context,
  useToolMeta: UseToolMeta,
  options: ContinuousFreehandOptions
) {
  let targetPosition = context.getTargetPosition(
    useToolMeta.position,
    useToolMeta
  );
  targetPosition = ipoint(() => Math.round(targetPosition));

  const brushSize = context.brush!.getDataSize(true);

  const lastPosition = context.getTargetPosition(options.lastPosition, {
    ...useToolMeta
  });

  const centerLastPosition = ipoint(() =>
    Math.round(lastPosition - brushSize / 2)
  );
  const centerTargetPosition = ipoint(() =>
    Math.round(targetPosition - brushSize / 2)
  );

  drawLine(
    (x: number, y: number) => {
      context.setDataRGBA(ipoint(x, y), context.brush!.data, brushSize);
    },
    centerLastPosition.x,
    centerLastPosition.y,
    centerTargetPosition.x,
    centerTargetPosition.y,
    {}
  );
}
