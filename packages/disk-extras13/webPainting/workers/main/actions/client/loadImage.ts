import {
  WORKER_ACTION_TYPE,
  type ActionSuccess
} from '@web-workbench/disk-extras13/webPainting/types/worker';
import type { Context } from '../../../../types/main';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import type {
  LoadImagePayload,
  LoadImageSuccessPayload
} from '../../../../types/worker.payload';

export default function loadImage(
  { ctx, updateDisplays }: Context,
  data: ActionCommandToMainWorker<LoadImagePayload>
): ActionSuccess<LoadImageSuccessPayload> {
  if (ctx) {
    const { imageBitmap } = data.payload;
    ctx.canvas.width = imageBitmap.width;
    ctx.canvas.height = imageBitmap.height;

    ctx.drawImage(imageBitmap, 0, 0);

    imageBitmap.close();

    updateDisplays();
  }
  return {
    type: WORKER_ACTION_TYPE.LOAD_IMAGE_SUCCESS
  };
}
