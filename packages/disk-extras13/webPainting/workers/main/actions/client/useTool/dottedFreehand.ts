import { ipoint } from '@js-basics/vector';
import type {
  Context,
  UseToolMeta
} from '@web-workbench/disk-extras13/webPainting/types/main';
import { BRUSH_TYPE } from '@web-workbench/disk-extras13/webPainting/types/select';

export default function dottedFreehand(
  context: Context,
  useToolMeta: UseToolMeta
) {
  if (context.useOptions.brush.type === BRUSH_TYPE.DOTS) {
    context.brush?.refresh();
  }

  const targetPosition = context.getTargetPosition(useToolMeta);
  const brushSize = context.brush!.getDataSize(true);

  context.setDataRGBA(
    ipoint(() => Math.round(targetPosition - brushSize / 2)),
    context.brush!.data,
    brushSize
  );
}
