import { ipoint } from '@js-basics/vector';
import type { Context, UseToolMeta } from '../../../../../types/main';
import type { AirBrushOptions } from '../../../../../lib/classes/tool/AirBrush';
import { createAirbrushBrushStamp } from '../../../../../lib/utils/paint';

export default function airBrush(
  context: Context,
  useToolMeta: UseToolMeta,
  options: AirBrushOptions
) {
  const targetPosition = context.getTargetPosition(
    useToolMeta.position,
    useToolMeta
  );
  const size = ipoint(10, 10);
  const data = createAirbrushBrushStamp(
    size,
    context.brush!.primaryColor,
    options.round,
    size.x,
    1
  );

  context.setDataRGBA(
    ipoint(() => Math.round(targetPosition - size / 2)),
    data,
    size
  );
}
