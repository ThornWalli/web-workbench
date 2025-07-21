import type { ActionSuccess } from '../../../../types/worker';
import type { IContext } from '../../../../types/worker/main';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import type { InsertImagePayload } from '../../../../types/worker.payload';
import { WORKER_ACTION_TYPE } from '../../../../types/worker';
import { insertImage as wasmInsertImage } from '@web-workbench/wasm';
import { processResize } from './resize';
import {
  toDimension,
  toPoint
} from '@web-workbench/disk-web-paint/webPaint/utils/wasm';
import { ORIGIN } from '@web-workbench/disk-web-paint/webPaint/types';
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';

export default async function insertIdmage(
  context: IContext,
  data: ActionCommandToMainWorker<InsertImagePayload>
): Promise<[ActionSuccess<InsertImagePayload>, Transferable[]]> {
  const { payload } = data;

  const dimension = context.getDimension();

  const resizedView = processResize(
    payload.buffer,
    payload.bufferDimension,
    payload.dimension,
    payload.type
  );

  let offset: IPoint & number;
  switch (payload.origin) {
    case ORIGIN.LEFT_TOP:
      offset = ipoint(0, 0);
      break;
    case ORIGIN.TOP:
      offset = ipoint((dimension.x - payload.dimension.x) / 2, 0);
      break;
    case ORIGIN.RIGHT_TOP:
      offset = ipoint(dimension.x - payload.dimension.x, 0);
      break;
    case ORIGIN.LEFT:
      offset = ipoint(0, (dimension.y - payload.dimension.y) / 2);
      break;
    case ORIGIN.RIGHT:
      offset = ipoint(
        dimension.x - payload.dimension.x,
        (dimension.y - payload.dimension.y) / 2
      );
      break;
    case ORIGIN.LEFT_BOTTOM:
      offset = ipoint(0, dimension.y - payload.dimension.y);
      break;
    case ORIGIN.BOTTOM:
      offset = ipoint(
        (dimension.x - payload.dimension.x) / 2,
        dimension.y - payload.dimension.y
      );
      break;
    case ORIGIN.RIGHT_BOTTOM:
      offset = ipoint(
        dimension.x - payload.dimension.x,
        dimension.y - payload.dimension.y
      );
      break;
    default:
      // case ORIGIN.CENTER:
      offset = ipoint(
        (dimension.x - payload.dimension.x) / 2,
        (dimension.y - payload.dimension.y) / 2
      );
  }

  wasmInsertImage(
    context.view!,
    toDimension(dimension),
    toPoint(ipoint(() => offset + payload.position)),
    new Uint8Array(resizedView),
    toDimension(payload.dimension)
  );

  context.updateTmpView();

  context.setupDisplays();
  context.update();

  return [
    {
      type: WORKER_ACTION_TYPE.INSERT_IMAGE_SUCCESS
    },
    []
  ];
}
