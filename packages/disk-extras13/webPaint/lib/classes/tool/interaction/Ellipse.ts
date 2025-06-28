import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import type {
  ToolConstructorOptions,
  ToolPointerEvent,
  ToolUseOptions
} from '../../Tool';
import { TOOLS } from '../../../../types/select';
import InteractionTool from '../InteractionTool';

interface Bounds {
  position: IPoint & number;
  dimension: IPoint & number;
}

export enum ELLIPSE_STATE {
  START = 'START',
  MOVE = 'MOVE',
  STOP = 'STOP'
}

export interface EllipseOptions extends ToolUseOptions {
  state?: ELLIPSE_STATE;
  position: IPoint & number;
  dimension: IPoint & number;
  square?: boolean;
}

export default class Ellipse<
  TOptions extends EllipseOptions = EllipseOptions
> extends InteractionTool<TOptions> {
  private bounds: Bounds = { position: ipoint(0, 0), dimension: ipoint(0, 0) };
  private startEvent?: ToolPointerEvent;

  constructor(options: ToolConstructorOptions<TOptions>) {
    super({
      ...options,
      type: TOOLS.ELLIPSE,
      options: {
        ...options.options,
        position: ipoint(0, 0),
        dimension: ipoint(0, 0)
      }
    });
  }

  override async pointerUp(e: ToolPointerEvent) {
    const { normalizePosition, normalizeDimension } = e;

    if (!this.startEvent) {
      return;
    }

    const bounds = this.bounds;

    this.startEvent = undefined;

    await this.app.actions.startStack();
    await this.action(
      {
        state: ELLIPSE_STATE.STOP,
        position: normalizePosition(bounds.position),
        dimension: normalizeDimension(bounds.dimension)
      } as TOptions,
      { event: e }
    );
    await this.app.actions.stopStack();
    this.reset(e);
  }

  override async pointerDown(e: ToolPointerEvent) {
    this.startEvent = e;

    const { ctx, normalizePosition, normalizeDimension } = e;
    ctx.beginPath();

    this.action(
      {
        state: ELLIPSE_STATE.START,
        stackable: false,
        position: normalizePosition(this.bounds.position),
        dimension: normalizeDimension(this.bounds.dimension)
      } as TOptions,
      { event: e }
    );
  }

  override pointerMove(e: ToolPointerEvent) {
    const { position, normalizePosition, normalizeDimension } = e;
    if (!this.startEvent) {
      return;
    }

    let dimension = ipoint(() => position - this.startEvent!.position);
    if (this.options.square) {
      dimension = ipoint(
        dimension.x,
        Math.abs(dimension.x) * (dimension.y < 0 ? -1 : 1)
      );
    }

    this.bounds = {
      position: this.startEvent.position,
      dimension
    };

    // const ctx = e.ctx;
    // const offset = ipoint(() => Math.min(this.bounds.dimension, 0));
    // const absDimension = ipoint(() => Math.abs(this.bounds.dimension));
    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // ctx.strokeStyle = `${this.color.toHex()}`;
    // ctx.lineWidth = 1;
    // ctx.beginPath();
    // ctx.ellipse(
    //   this.bounds.position.x + absDimension.x / 2 + offset.x,
    //   this.bounds.position.y + absDimension.y / 2 + offset.y,
    //   absDimension.x / 2,
    //   absDimension.y / 2,
    //   0,
    //   0,
    //   2 * Math.PI
    // );
    // ctx.closePath();
    // ctx.stroke();

    this.action(
      {
        state: ELLIPSE_STATE.MOVE,
        stackable: false,
        position: normalizePosition(this.bounds.position),
        dimension: normalizeDimension(this.bounds.dimension)
      } as TOptions,
      { event: e }
    );
  }

  override reset(e: ToolPointerEvent) {
    super.reset(e);
    const { ctx } = e;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}
