import {
  WORKER_ACTION_TYPE,
  type ActionSuccess
} from '../../../../types/worker';
import type { Context, UseToolMeta } from '../../../../types/main';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import type {
  UseToolPayload,
  UseToolSuccessPayload
} from '../../../../types/worker.payload';
import { TOOLS } from '../../../../types/select';
import type { ContinuousFreehandOptions } from '../../../../lib/classes/tool/ContinuousFreehand';
import continuousFreehand from './useTool/continuousFreehand';
import dottedFreehand from './useTool/dottedFreehand';
import clear from './useTool/clear';
import type { ToolUseOptions } from '../../../../lib/classes/Tool';

export default function drawBrush(
  context: Context,
  data: ActionCommandToMainWorker<UseToolPayload>
): ActionSuccess<UseToolSuccessPayload> {
  const { payload } = data;
  const { tool, meta, toolOptions } = payload;

  if (payload.toolOptions.stackable && context.actionStack.active) {
    // If the tool is stackable, we add the current state to the stack
    context.addActionStack(tool, payload);
  }

  executeAction(context, {
    tool,
    meta,
    toolOptions
  });

  context.updateDisplays();

  return {
    type: WORKER_ACTION_TYPE.USE_TOOL_SUCCESS
  };
}

export function executeAction(
  context: Context,
  {
    tool,
    meta,
    toolOptions
  }: {
    tool: TOOLS;
    meta?: UseToolMeta;
    toolOptions?: ToolUseOptions;
  }
) {
  switch (tool) {
    case TOOLS.CLEAR:
      {
        clear(context);
      }
      break;

    case TOOLS.DOTTED_FREEHAND:
      {
        dottedFreehand(context, meta!);
      }
      break;

    case TOOLS.CONTINUOUS_FREEHAND: {
      continuousFreehand(
        context,
        meta!,
        toolOptions as ContinuousFreehandOptions
      );
    }
  }
}
