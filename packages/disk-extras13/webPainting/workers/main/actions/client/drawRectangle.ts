import {
  WORKER_ACTION_TYPE,
  type ActionSuccess
} from '../../../../types/worker';
import type { Context } from '../../../../types/main';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import type {
  DrawRectanglePayload,
  DrawRectangleSuccessPayload
} from '../../../../types/worker.payload';

export default function drawRectangle(
  { ctx, offscreenCanvas, updateDisplays }: Context,
  data: ActionCommandToMainWorker<DrawRectanglePayload>
): ActionSuccess<DrawRectangleSuccessPayload> {
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

  return {
    type: WORKER_ACTION_TYPE.DRAW_RECTANGLE_SUCCESS
  };
}
