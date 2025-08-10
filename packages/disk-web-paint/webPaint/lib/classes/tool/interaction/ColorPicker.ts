import { TOOL } from '../../../../types/select';
import type { ToolConstructorOptions } from '../../Tool';
import InteractionTool from '../InteractionTool';
import type { InteractionOptions } from '../InteractionTool';
import type { IPoint } from '@js-basics/vector';
import type Color from '@web-workbench/core/classes/Color';
import type { ColorPickerSuccessPayload } from '../../../../types/worker.payload';
import type {
  ActionSuccess,
  WORKER_ACTION_TYPE
} from '@web-workbench/disk-web-paint/webPaint/types/worker';
import type ToolPointerEvent from '../../ToolPointerEvent';

export default class ColorPicker extends InteractionTool {
  result?: {
    color: Color;
    position: IPoint & number;
  };

  constructor(
    options: Omit<ToolConstructorOptions<InteractionOptions>, 'type'>
  ) {
    super({
      ...options,
      interactingMove: false,
      type: TOOL.COLOR_PICKER
    });
  }

  override cancel(e: ToolPointerEvent): void {
    this.reset(e);
  }

  override async pointerDown(e: ToolPointerEvent) {
    await super.pointerDown(e);
    if (this.result) {
      if (this.domEvents.shiftActive) {
        this.app.options.select.color.secondaryColor.setColor(
          this.result.color
        );
      } else {
        this.app.options.select.color.primaryColor.setColor(this.result.color);
      }
    }
  }

  override async pointerMoveStatic(e: ToolPointerEvent): Promise<void> {
    await super.pointerMoveStatic(e);
    const display = this.getDisplay();
    if (display) {
      const { payload } = await this.action<
        ActionSuccess<
          ColorPickerSuccessPayload,
          WORKER_ACTION_TYPE.COLOR_PICKER_SUCCESS
        >
      >({}, { event: e });

      const ctx = e.ctx;
      ctx.clearRect(0, 0, e.ctx.canvas.width, e.ctx.canvas.height);
      const { color, position } = payload!;
      if (payload!.color) {
        this.result = {
          color,
          position
        };
      }
    }
  }

  override reset(e: ToolPointerEvent): void {
    const ctx = e.ctx;
    ctx.clearRect(0, 0, e.ctx.canvas.width, e.ctx.canvas.height);
    this.result = undefined;
    super.reset(e);
  }
}
