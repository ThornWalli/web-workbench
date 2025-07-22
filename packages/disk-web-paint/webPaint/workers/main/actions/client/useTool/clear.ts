import { clear as wasmClear } from '@web-workbench/wasm';
import type { IContext } from '../../../../../types/worker/main';
import { toDimension } from '@web-workbench/disk-web-paint/webPaint/utils/wasm';

export default function clear(context: IContext) {
  wasmClear(
    context.layerManager.currentLayer.view!,
    toDimension(context.getDimension())
  );
  context.layerManager.currentLayer.updateTmpView();
}
