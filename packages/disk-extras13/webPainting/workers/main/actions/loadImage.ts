import type { MainContext } from '@web-workbench/disk-extras13/webPainting/types/worker';
import type { ActionCommandToMainWorker } from '@web-workbench/disk-extras13/webPainting/types/worker.message.main';

import type { LoadImagePayload } from '@web-workbench/disk-extras13/webPainting/types/worker.payload';

export default function loadImage(
  { ctx, updateDisplays }: MainContext,
  data: ActionCommandToMainWorker<LoadImagePayload>
) {
  if (ctx) {
    const { imageBitmap } = data.payload;

    ctx.drawImage(imageBitmap, 0, 0);
    imageBitmap.close();

    updateDisplays();
  }
}
