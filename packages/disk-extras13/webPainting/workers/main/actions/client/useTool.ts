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
import straightLine from './useTool/straightLine';
import curveLine from './useTool/curveLine';
import airBrush from './useTool/airBrush';
import rectangle from './useTool/rectangle';
import ellipse from './useTool/ellipse';
import polygon from './useTool/polygon';
import crop from './useTool/crop';
import clear from './useTool/clear';
import fill from './useTool/fill';

import type { ToolUseOptions } from '../../../../lib/classes/Tool';
import type { StraightLineOptions } from '../../../../lib/classes/tool/StraightLine';
import type { CurveLineOptions } from '../../../../lib/classes/tool/CurveLine';
import type { RectangleOptions } from '../../../../lib/classes/tool/Rectangle';
import type { EllipseOptions } from '../../../../lib/classes/tool/Ellipse';
import type { PolygonOptions } from '../../../../lib/classes/tool/Polygon';
import type { FillOptions } from '../../../../lib/classes/tool/Fill';
import type { AirBrushOptions } from '@web-workbench/disk-extras13/webPainting/lib/classes/tool/AirBrush';
import type { CropOptions } from '@web-workbench/disk-extras13/webPainting/lib/classes/tool/Crop';

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

// eslint-disable-next-line complexity
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

    case TOOLS.CONTINUOUS_FREEHAND:
      {
        continuousFreehand(
          context,
          meta!,
          toolOptions as ContinuousFreehandOptions
        );
      }
      break;

    case TOOLS.STRAIGHT_LINE:
      {
        straightLine(context, meta!, toolOptions as StraightLineOptions);
      }
      break;

    case TOOLS.CURVE_LINE:
      {
        curveLine(context, meta!, toolOptions as CurveLineOptions);
      }
      break;

    case TOOLS.AIR_BRUSH:
      {
        airBrush(context, meta!, toolOptions as AirBrushOptions);
      }
      break;

    case TOOLS.RECTANGLE:
      {
        rectangle(context, meta!, toolOptions as RectangleOptions);
      }
      break;

    case TOOLS.CIRCLE:
      {
        ellipse(context, meta!, toolOptions as EllipseOptions);
      }
      break;

    case TOOLS.ELLIPSE:
      {
        ellipse(context, meta!, toolOptions as EllipseOptions);
      }
      break;

    case TOOLS.POLYGON:
      {
        polygon(context, meta!, toolOptions as PolygonOptions);
      }
      break;

    case TOOLS.FILL_TOOL:
      {
        fill(context, meta!, toolOptions as FillOptions);
      }
      break;

    case TOOLS.CROP:
      {
        crop(context, meta!, toolOptions as CropOptions);
      }
      break;

    default:
      console.warn(
        `Tool ${tool} is not implemented or not supported in this context.`
      );
  }
}
