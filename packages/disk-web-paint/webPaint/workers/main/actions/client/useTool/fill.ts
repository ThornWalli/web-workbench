import type { Context, UseToolMeta } from '../../../../../types/main';
import type { FillOptions } from '../../../../../lib/classes/tool/interaction/Fill';
import { drawFill } from '@web-workbench/wasm/pkg/wasm';
import {
  toColor,
  toDimension,
  toPoint
} from '@web-workbench/disk-web-paint/webPaint/utils/wasm';

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

  const dimension = context.getDimension();

  drawFill(
    context.view!,
    toDimension(dimension),
    toPoint(targetPosition),
    toColor(context.brushDescription!.primaryColor)
  );
}
