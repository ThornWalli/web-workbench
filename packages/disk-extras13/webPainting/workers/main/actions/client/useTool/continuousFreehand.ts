import { ipoint } from '@js-basics/vector';
import type { ContinuousFreehandOptions } from '@web-workbench/disk-extras13/webPainting/lib/classes/tool/ContinuousFreehand';
import { line as drawLine } from '@web-workbench/disk-extras13/webPainting/lib/utils/paint';
import type {
  Context,
  UseToolMeta
} from '@web-workbench/disk-extras13/webPainting/types/main';
import { BRUSH_TYPE } from '@web-workbench/disk-extras13/webPainting/types/select';

export default function continuousFreehand(
  context: Context,
  useToolMeta: UseToolMeta,
  options: ContinuousFreehandOptions
) {
  if (context.useOptions.brush.type === BRUSH_TYPE.DOTS) {
    context.brush?.refresh();
  }

  const targetPosition = context.getTargetPosition(useToolMeta);
  const brushSize = context.brush!.getDataSize(true);

  const lastPosition = context.getTargetPosition({
    ...useToolMeta,
    position: options.lastPosition
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
