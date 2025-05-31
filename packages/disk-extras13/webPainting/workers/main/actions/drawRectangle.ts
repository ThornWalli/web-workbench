import type { MainContext } from '@web-workbench/disk-extras13/webPainting/types/worker';
import type { ActionCommandToMainWorker } from '@web-workbench/disk-extras13/webPainting/types/worker.message.main';
import type { DrawRectanglePayload } from '@web-workbench/disk-extras13/webPainting/types/worker.payload';

export default function drawRectangle(
  { ctx, offscreenCanvas, updateDisplays }: MainContext,
  data: ActionCommandToMainWorker<DrawRectanglePayload>
) {
  const rectCommand = data.payload;
  console.log(
    '1 Main Canvas Worker received draw rectangle command:',
    rectCommand
  );
  if (ctx && offscreenCanvas) {
    console.log(
      '2 Main Canvas Worker received draw rectangle command:',
      rectCommand
    );
    ctx.fillStyle = rectCommand.color;
    ctx.fillRect(
      rectCommand.x,
      rectCommand.y,
      rectCommand.width,
      rectCommand.height
    );
    console.log('Main Canvas Worker drew persistent rectangle:', rectCommand);

    updateDisplays();
  }
}
