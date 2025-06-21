import { fill } from '../../../../../lib/utils/paint';
import type { Context, UseToolMeta } from '../../../../../types/main';
import { ipoint } from '@js-basics/vector';
import type { FillOptions } from '../../../../../lib/classes/tool/Fill';

export default function (
  context: Context,
  useToolMeta: UseToolMeta,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options: FillOptions
) {
  const targetPosition = context.getTargetPosition(
    useToolMeta.position,
    useToolMeta
  );

  const [fillData, fillSize] = [
    new Uint8ClampedArray(context.brush!.primaryColor.toRGBA()),
    ipoint(1, 1)
  ];

  const dimension = context.getDimension();

  fill(
    (x: number, y: number) => {
      context.setDataRGBA(
        ipoint(Math.round(x), Math.round(y)),
        fillData,
        fillSize
      );
    },
    (x: number, y: number) => {
      return context.getColorByPosition(ipoint(x, y))!;
    },
    context.brush!.primaryColor,
    targetPosition.x,
    targetPosition.y,
    dimension.x,
    dimension.y
  );
}
