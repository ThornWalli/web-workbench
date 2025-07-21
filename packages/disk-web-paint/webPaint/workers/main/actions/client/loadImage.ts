import { WORKER_ACTION_TYPE } from '../../../../types/worker';
import type { ActionSuccess } from '../../../../types/worker';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import type {
  LoadImagePayload,
  LoadImageSuccessPayload
} from '../../../../types/worker.payload';
import { ipoint } from '@js-basics/vector';
import type { IContext } from '../../../../types/worker/main';

export default async function loadImage(
  context: IContext,
  data: ActionCommandToMainWorker<LoadImagePayload>
): Promise<ActionSuccess<LoadImageSuccessPayload>> {
  const { imageBitmap } = data.payload;

  const width = imageBitmap.width;
  const height = imageBitmap.height;
  const bufferSize = width * height * 4;

  const sharedBuffer = new SharedArrayBuffer(bufferSize);

  await imageBitmapToSharedBuffer(imageBitmap, sharedBuffer, width, height);
  imageBitmap.close();

  context.setSharedBuffer(sharedBuffer, ipoint(width, height));

  context.setupDisplays();
  context.update();

  return {
    type: WORKER_ACTION_TYPE.LOAD_IMAGE_SUCCESS
  };
}

async function imageBitmapToSharedBuffer(
  imageBitmap: ImageBitmap,
  sharedBuffer: SharedArrayBuffer,
  width: number,
  height: number
) {
  const offscreen = new OffscreenCanvas(width, height);
  const ctx = offscreen.getContext('2d')!;
  ctx.drawImage(imageBitmap, 0, 0, width, height);
  const imgData = ctx.getImageData(0, 0, width, height);
  const target = new Uint8ClampedArray(sharedBuffer);
  target.set(imgData.data);
}
