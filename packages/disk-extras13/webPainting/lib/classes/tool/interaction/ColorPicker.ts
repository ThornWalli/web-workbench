import { TOOLS } from '@web-workbench/disk-extras13/webPainting/types/select';
import type { ToolConstructorOptions, ToolPointerEvent } from '../../Tool';
import InteractionTool from '../InteractionTool';
import { ipoint, type IPoint } from '@js-basics/vector';
import type { Color } from '../../Color';
import type { ColorPickerSuccessPayload } from '@web-workbench/disk-extras13/webPainting/types/worker.payload';
import type {
  ActionSuccess,
  WORKER_ACTION_TYPE
} from '@web-workbench/disk-extras13/webPainting/types/worker';

export default class ColorPicker extends InteractionTool {
  lastColor?: Color | undefined;

  constructor(options: Omit<ToolConstructorOptions, 'type' | 'options'>) {
    super({
      ...options,
      interactingMove: false,
      type: TOOLS.COLOR_PICKER,
      options: {}
    });
  }

  override async pointerDown(e: ToolPointerEvent) {
    await super.pointerDown(e);
    if (this.lastColor) {
      this.app.setSelectOptions('color', {
        ...this.app.options.select.color,
        primaryColor: this.lastColor
      });
    }
  }

  override async pointerMove(e: ToolPointerEvent): Promise<void> {
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
        this.lastColor = color;
        drawColorPickerInfo(ctx, ipoint(10, 10), {
          color,
          position
        });
      }
    }
  }
}

function drawColorPickerInfo(
  ctx: CanvasRenderingContext2D,
  position: IPoint & number,
  options: {
    position: IPoint & number;
    color: Color;
  }
) {
  ctx.fillStyle = '#000';
  ctx.fillRect(position.x, position.y, 188, 32);

  ctx.fillStyle = options.color.toHex();
  ctx.fillRect(position.x + 6, position.y + 6, 20, 20);

  ctx.fillStyle = '#fff';

  const fontSize = 10;
  const textPosition = ipoint(() => position + ipoint(32, 4 + fontSize));

  ctx.font = `${fontSize}px "BitFontCanvas"`;
  ctx.fontKerning = 'normal';
  ctx.letterSpacing = '0px';
  ctx.fillText(
    `Color   : ${options.color.toHex()}`,
    textPosition.x,
    textPosition.y
  );
  ctx.fillText(
    `Position: ${options.position.x},${options.position.y}`,
    textPosition.x,
    textPosition.y + fontSize + 4
  );
}
