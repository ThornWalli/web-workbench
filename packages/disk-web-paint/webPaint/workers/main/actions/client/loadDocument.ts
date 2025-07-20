import { WORKER_ACTION_TYPE } from '../../../../types/worker';
import type { ActionSuccess } from '../../../../types/worker';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import type {
  LoadDocumentPayload,
  LoadDocumentSuccessPayload
} from '../../../../types/worker.payload';
import { ipoint } from '@js-basics/vector';
import type { IContext } from '../../../../types/worker/main';
import Layer from '../../../../lib/classes/Layer';

export default async function loadImage(
  context: IContext,
  data: ActionCommandToMainWorker<LoadDocumentPayload>
): Promise<ActionSuccess<LoadDocumentSuccessPayload>> {
  const { layers } = data.payload;

  const preparedLayers = await Promise.all(
    layers.map(async layer => {
      const imageBitmap = layer.imageBitmap;
      const width = imageBitmap.width;
      const height = imageBitmap.height;
      const bufferSize = width * height * 4;

      const buffer = new SharedArrayBuffer(bufferSize);

      await imageBitmapToSharedBuffer(imageBitmap, buffer, width, height);
      imageBitmap.close();

      return new Layer({
        id: layer.id,
        name: layer.name,
        dimension: ipoint(width, height),
        buffer
      });
    })
  );

  context.layerManager.setLayers(preparedLayers);

  context.updateClient();
  context.setupDisplays();

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
