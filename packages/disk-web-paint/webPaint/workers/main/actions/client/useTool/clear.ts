import { clear as wasmClear } from '@web-workbench/wasm/pkg/wasm';
import type { Context } from '../../../../../types/worker/main';
import { toDimension } from '@web-workbench/disk-web-paint/webPaint/utils/wasm';

export default function clear(context: Context) {
  wasmClear(context.view!, toDimension(context.getDimension()));
  context.updateTmpView();
}
