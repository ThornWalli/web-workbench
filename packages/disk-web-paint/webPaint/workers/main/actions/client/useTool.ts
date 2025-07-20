import { WORKER_ACTION_TYPE } from '../../../../types/worker';
import type { ActionSuccess } from '../../../../types/worker';
import type { IContext, UseToolMeta } from '../../../../types/worker/main';
import type { ActionCommandToMainWorker } from '../../../../types/worker.message.main';
import type {
  UseToolPayload,
  UseToolSuccessPayload
} from '../../../../types/worker.payload';
import { TOOL } from '../../../../types/select';
import type { ContinuousFreehandOptions } from '../../../../lib/classes/tool/interaction/ContinuousFreehand';
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
import colorPicker from './useTool/colorPicker';

import type { ToolUseOptions } from '../../../../lib/classes/Tool';
import type { StraightLineOptions } from '../../../../lib/classes/tool/interaction/StraightLine';
import type { CurveLineOptions } from '../../../../lib/classes/tool/interaction/CurveLine';
import type { RectangleOptions } from '../../../../lib/classes/tool/interaction/Rectangle';
import type { EllipseOptions } from '../../../../lib/classes/tool/interaction/Ellipse';
import type { PolygonOptions } from '../../../../lib/classes/tool/interaction/Polygon';
import type { FillOptions } from '../../../../lib/classes/tool/interaction/Fill';
import type { AirBrushOptions } from '@web-workbench/disk-web-paint/webPaint/lib/classes/tool/interaction/AirBrush';
import type { CropOptions } from '@web-workbench/disk-web-paint/webPaint/lib/classes/tool/interaction/Crop';
import imageOperation from './useTool/imageOperation';
import type { ImageOperationOptions } from '@web-workbench/disk-web-paint/webPaint/lib/classes/tool/interaction/abstract/ImageOperation';
import type { DottedFreehandOptions } from '@web-workbench/disk-web-paint/webPaint/lib/classes/tool/interaction/DottedFreehand';

export default async function useTool(
  context: IContext,
  data: ActionCommandToMainWorker<UseToolPayload>
): Promise<ActionSuccess<UseToolSuccessPayload>> {
  const { payload } = data;
  const { tool, meta, toolOptions } = payload;

  if (payload.toolOptions.stackable && context.actionStack.active) {
    // If the tool is stackable, we add the current state to the stack
    context.addActionStack(tool, payload);
  }

  const result = await executeAction(context, {
    tool,
    meta,
    toolOptions
  });

  const ignoreLayers = toolOptions.stackable;

  context.update({
    ignoreLayers
  });

  return (
    result || {
      type: WORKER_ACTION_TYPE.USE_TOOL_SUCCESS
    }
  );
}

// eslint-disable-next-line complexity
export function executeAction(
  context: IContext,
  {
    tool,
    meta,
    toolOptions
  }: {
    tool: TOOL;
    meta?: UseToolMeta;
    toolOptions?: ToolUseOptions;
  }
) {
  switch (tool) {
    case TOOL.CLEAR:
      {
        clear(context);
      }
      break;

    case TOOL.DOTTED_FREEHAND:
      {
        dottedFreehand(context, meta!, toolOptions as DottedFreehandOptions);
      }
      break;

    case TOOL.CONTINUOUS_FREEHAND:
      {
        continuousFreehand(
          context,
          meta!,
          toolOptions as ContinuousFreehandOptions
        );
      }
      break;

    case TOOL.STRAIGHT_LINE:
      {
        straightLine(context, meta!, toolOptions as StraightLineOptions);
      }
      break;

    case TOOL.CURVE_LINE:
      {
        curveLine(context, meta!, toolOptions as CurveLineOptions);
      }
      break;

    case TOOL.AIR_BRUSH:
      {
        airBrush(context, meta!, toolOptions as AirBrushOptions);
      }
      break;

    case TOOL.RECTANGLE:
      {
        rectangle(context, meta!, toolOptions as RectangleOptions);
      }
      break;

    case TOOL.CIRCLE:
      {
        ellipse(context, meta!, toolOptions as EllipseOptions);
      }
      break;

    case TOOL.ELLIPSE:
      {
        ellipse(context, meta!, toolOptions as EllipseOptions);
      }
      break;

    case TOOL.POLYGON:
      {
        polygon(context, meta!, toolOptions as PolygonOptions);
      }
      break;

    case TOOL.FILL_TOOL:
      {
        fill(context, meta!, toolOptions as FillOptions);
      }
      break;

    case TOOL.CROP:
      {
        crop(context, meta!, toolOptions as CropOptions);
      }
      break;

    case TOOL.IMAGE_OPERATION:
      {
        imageOperation(context, toolOptions as ImageOperationOptions);
      }
      break;

    case TOOL.COLOR_PICKER: {
      return colorPicker(context, meta!);
    }

    default:
      console.warn(
        `Tool ${tool} is not implemented or not supported in this context.`
      );
  }
}
