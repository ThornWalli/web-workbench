import type { Context } from '@web-workbench/disk-extras13/webPainting/types/display';
import type { ActionCommandToDisplayWorker } from '@web-workbench/disk-extras13/webPainting/types/worker.message.display';
import type { SetPositionPayload } from '@web-workbench/disk-extras13/webPainting/types/worker.payload';

export default function setPosition(
  context: Context,
  data: ActionCommandToDisplayWorker<SetPositionPayload>
) {
  context.setPosition(data.payload.position);
  context.draw();
}
