import { ipoint } from '@js-basics/vector';
import type { Context, UseToolMeta } from '../../../../../types/main';
import type { AirBrushOptions } from '../../../../../lib/classes/tool/interaction/AirBrush';
import { drawAirBrush } from '@web-workbench/wasm/pkg/wasm';
import {
  toAirBrushOptions,
  toColor,
  toDimension,
  toPoint
} from '@web-workbench/disk-extras13/webPaint/utils/wasm';

export default function airBrush(
  context: Context,
  useToolMeta: UseToolMeta,
  options: AirBrushOptions
) {
  const targetPosition = context.getTargetPosition(
    useToolMeta.position,
    useToolMeta
  );
  const size_ = context.brushDescription?.getSize() || 1;
  const size = ipoint(size_, size_);

  drawAirBrush(
    context.viewTest!,
    toDimension(context.getDimension()),
    toPoint(ipoint(targetPosition.x, targetPosition.y)),
    toDimension(size),
    toColor(context.brushDescription!.primaryColor),
    toAirBrushOptions({
      round: options.round,
      strength: context.useOptions.tool.airBrushStrength || 100,
      weight: context.useOptions.tool.airBrushWeight || 100
    })
  );

  // const data = createAirbrushBrushStamp(
  //   size,
  //   context.brush!.primaryColor,
  //   options.round,
  //   size.x,
  //   context.useOptions.tool.airBrushStrength || 1
  // );

  // context.setDataRGBA(
  //   ipoint(() => Math.round(targetPosition - size / 2)),
  //   data,
  //   size
  // );
}
