import {
  WORKER_ACTION_TYPE,
  type ActionSuccess
} from '../../../../types/worker';
import type { Context } from '../../../../types/main';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import {
  STACK_ACTION,
  type StackPayload,
  type StackSuccessPayload
} from '../../../../types/worker.payload';

export default async function stack(
  context: Context,
  data: ActionCommandToMainWorker<StackPayload>
): Promise<Promise<ActionSuccess<StackSuccessPayload>>> {
  switch (data.payload.action) {
    case STACK_ACTION.START:
      {
        context.actionStack.start();
      }
      break;
    case STACK_ACTION.STOP:
      {
        context.actionStack.stop();
      }
      break;

    case STACK_ACTION.FORWARD:
      {
        await context.actionStack.forward();
      }
      break;

    case STACK_ACTION.BACKWARD: {
      await context.actionStack.backward();
    }
  }
  return {
    type: WORKER_ACTION_TYPE.STACK_SUCCESS
  };
}
