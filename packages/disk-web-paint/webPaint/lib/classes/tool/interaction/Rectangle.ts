import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import type { ToolConstructorOptions } from '../../Tool';
import { TOOL } from '../../../../types/select';
import InteractionTool from '../InteractionTool';
import type { InteractionOptions } from '../InteractionTool';
import type ToolPointerEvent from '../../ToolPointerEvent';

interface Bounds {
  position: IPoint & number;
  dimension: IPoint & number;
}

export enum RECTANGLE_STATE {
  START = 'START',
  MOVE = 'MOVE',
  STOP = 'STOP'
}

export interface RectangleOptions extends InteractionOptions {
  state?: RECTANGLE_STATE;
  position: IPoint & number;
  dimension: IPoint & number;
}

export default class Rectangle extends InteractionTool<RectangleOptions> {
  private startEvent?: ToolPointerEvent;
  private bounds: Bounds = { position: ipoint(0, 0), dimension: ipoint(0, 0) };

  constructor(
    options: Omit<ToolConstructorOptions<InteractionOptions>, 'type'>
  ) {
    super({
      ...options,
      type: TOOL.RECTANGLE,
      options: {
        ...options.options,
        position: ipoint(0, 0),
        dimension: ipoint(0, 0)
      }
    });
  }

  override async pointerUp(e: ToolPointerEvent) {
    if (!this.startEvent) {
      return;
    }

    const bounds = this.bounds;

    this.startEvent = undefined;

    await this.app.actions.startStack();
    await this.action(
      {
        state: RECTANGLE_STATE.STOP,
        position: e.normalizePosition(bounds.position),
        dimension: e.normalizeDimension(bounds.dimension)
      },
      { event: e }
    );
    await this.app.actions.stopStack();
    this.reset(e);
  }

  override async pointerDown(e: ToolPointerEvent) {
    await super.pointerDown(e);
    this.startEvent = e;

    e.ctx.beginPath();

    this.action(
      {
        state: RECTANGLE_STATE.START,
        stackable: false,
        position: e.normalizePosition(this.bounds.position),
        dimension: e.normalizeDimension(this.bounds.dimension)
      },
      { event: e }
    );
  }

  override pointerMove(e: ToolPointerEvent) {
    if (!this.startEvent) {
      return;
    }
    this.bounds = {
      position: this.startEvent.position,
      dimension: ipoint(() => e.position - this.startEvent!.position)
    };

    // const ctx = e.ctx;
    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // ctx.strokeStyle = `${this.color.toHex()}`;
    // ctx.lineWidth = 1;

    // ctx.strokeRect(
    //   this.bounds.position.x,
    //   this.bounds.position.y,
    //   this.bounds.dimension.x,
    //   this.bounds.dimension.y
    // );

    this.action(
      {
        state: RECTANGLE_STATE.MOVE,
        stackable: false,
        position: e.normalizePosition(this.bounds.position),
        dimension: e.normalizeDimension(this.bounds.dimension)
      },
      { event: e }
    );
  }

  override reset(e: ToolPointerEvent) {
    super.reset(e);
    const { ctx } = e;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}
