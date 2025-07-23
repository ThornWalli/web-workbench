import { ipoint } from '@js-basics/vector';
import type { IContext, UseToolMeta } from '../../../../../types/worker/main';
import type { AirBrushOptions } from '../../../../../lib/classes/tool/interaction/AirBrush';
import { drawAirBrush } from '@web-workbench/wasm';
import {
  toAirBrushOptions,
  toDimension,
  toPoint
} from '@web-workbench/disk-web-paint/webPaint/utils/wasm';

export default function airBrush(
  context: IContext,
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
    context.layerManager.currentLayer.view!,
    toDimension(context.getDimension()),
    toPoint(ipoint(targetPosition.x, targetPosition.y)),
    toDimension(size),
    toAirBrushOptions({
      round: options.round,
      strength: context.useOptions.tool.airBrushStrength || 100,
      weight: context.useOptions.tool.airBrushWeight || 100,
      seed: useToolMeta.seed
    })
  );

  context.layerManager.currentLayer.updateTmpView();
}
