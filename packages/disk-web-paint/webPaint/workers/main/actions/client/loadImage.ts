import {
  WORKER_ACTION_TYPE,
  type ActionSuccess
} from '../../../../types/worker';
import type { Context } from '../../../../types/main';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import type {
  LoadImagePayload,
  LoadImageSuccessPayload
} from '../../../../types/worker.payload';
import { ipoint } from '@js-basics/vector';

export default async function loadImage(
  { setSharedBuffer, setupDisplays }: Context,
  data: ActionCommandToMainWorker<LoadImagePayload>
): Promise<ActionSuccess<LoadImageSuccessPayload>> {
  const { imageBitmap } = data.payload;

  const width = imageBitmap.width;
  const height = imageBitmap.height;
  const bufferSize = width * height * 4;

  const sharedBuffer = new SharedArrayBuffer(bufferSize);

  await imageBitmapToSharedBuffer(imageBitmap, sharedBuffer, width, height);
  imageBitmap.close();

  setSharedBuffer(sharedBuffer, ipoint(width, height));

  setupDisplays();

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
