import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import Tool, {
  type ToolConstructorOptions,
  type ToolPointerEvent
} from '../Tool';
import { WORKER_ACTION_TYPE } from '../../../types/worker';
import { TOOLS } from '../../../types/select';
import { Color } from '../Color';

interface Bounds {
  position: IPoint & number;
  dimension: IPoint & number;
}

export default class Magnify extends Tool {
  private bounds?: Bounds;
  private startPosition?: IPoint & number;
  color: Color = new Color(255, 170, 85, 1);

  constructor(options: Omit<ToolConstructorOptions, 'type' | 'options'>) {
    super({
      ...options,
      type: TOOLS.MAGNIFY,
      options: {}
    });
  }

  override async pointerUp({
    dimension,
    ctx,
    normalizePosition
  }: ToolPointerEvent) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (!this.startPosition || !this.bounds) {
      return;
    }

    const bounds = this.bounds!;
    const display = this.getDisplay();

    const factor = ipoint(() =>
      Math.abs((dimension / bounds.dimension) * display.app.options.zoomStep)
    );

    if (factor.x === Infinity || factor.y === Infinity) {
      return;
    }

    const position = normalizePosition(
      ipoint(() => bounds.position + bounds.dimension / 2)
    );

    const zoomLevel =
      1 +
      (this.domEvents.shiftLeftActive ? -1 : 1) * Math.max(factor.x, factor.y);

    this.startPosition = undefined;

    await display.action({
      type: WORKER_ACTION_TYPE.SET_ZOOM,
      payload: {
        zoomLevel: zoomLevel,
        position
      }
    });
  }

  override async pointerDown({ position, ctx }: ToolPointerEvent) {
    this.startPosition = position;
    ctx.beginPath();
  }

  override pointerMove({ position, ctx }: ToolPointerEvent) {
    if (!this.startPosition) {
      return;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = `2px ${this.color.toHex()}`;
    ctx.lineWidth = 2;

    this.bounds = {
      position: this.startPosition,
      dimension: ipoint(() => position - this.startPosition!)
    };

    ctx.strokeRect(
      this.bounds.position.x,
      this.bounds.position.y,
      this.bounds.dimension.x,
      this.bounds.dimension.y
    );
  }
}
