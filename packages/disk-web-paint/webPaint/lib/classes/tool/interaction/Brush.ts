import type { ToolConstructorOptions } from '../../Tool';
import type ToolPointerEvent from '../../ToolPointerEvent';
import InteractionTool from '../InteractionTool';
import type { InteractionOptions } from '../InteractionTool';

export enum BRUSH_STATE {
  DRAW = 'DRAW',
  RESET = 'RESET',
  MOVE = 'MOVE'
}

export interface BrushOptions extends InteractionOptions {
  state?: BRUSH_STATE;
  replaceColor?: boolean;
}

export default class Brush<
  TOptions extends BrushOptions = BrushOptions
> extends InteractionTool<TOptions> {
  active: boolean = false;

  constructor(options: ToolConstructorOptions<TOptions>) {
    super({
      ...options,
      options: {
        ...options.options,
        stackable: true
      }
    });
  }

  override async pointerMove(e: ToolPointerEvent) {
    if (e.isIntersecting()) {
      await this.action(
        {
          state: BRUSH_STATE.DRAW
        } as TOptions,
        { event: e }
      );
    }
    super.pointerMove(e);
  }

  override async pointerMoveStatic(e: ToolPointerEvent) {
    if (!this.active) {
      await this.action(
        {
          state: BRUSH_STATE.MOVE,
          stackable: false
        } as TOptions,
        { event: e }
      );
    }
    super.pointerMoveStatic(e);
  }

  override async pointerDown(e: ToolPointerEvent) {
    await super.pointerDown(e);
    await this.app.actions.startStack();
    this.active = true;
    await this.action(
      {
        state: BRUSH_STATE.DRAW
      } as TOptions,
      { event: e }
    );
  }

  override async pointerCancel(e: ToolPointerEvent) {
    this.cancel(e);
    await super.pointerCancel(e);
  }

  override async cancel(e: ToolPointerEvent) {
    this.active = false;
    await this.action(
      {
        state: BRUSH_STATE.RESET
      } as TOptions,
      { event: e }
    );
    await super.pointerCancel(e);
  }

  override async pointerUp(e: ToolPointerEvent) {
    this.active = false;
    await this.app.actions.stopStack();
    return super.pointerUp(e);
  }
}
