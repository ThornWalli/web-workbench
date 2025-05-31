import type { MainContext } from '@web-workbench/disk-extras13/webPainting/types/worker';
import type { ActionCommandToMainWorker } from '@web-workbench/disk-extras13/webPainting/types/worker.message.main';
import type { ZoomPayload } from '@web-workbench/disk-extras13/webPainting/types/worker.payload';

export default function zoom(
  { ctx, updateDisplays }: MainContext,
  data: ActionCommandToMainWorker<ZoomPayload>
) {
  if (ctx) {
    console.log(data);
    // const { imageBitmap } = event.data.payload;

    // ctx.drawImage(imageBitmap, 0, 0);
    // imageBitmap.close();

    updateDisplays();
  }
}
