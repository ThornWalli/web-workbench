import type {
  ToolConstructorOptions,
  ToolPointerEvent,
  ToolUseOptions
} from '../../Tool';
import InteractionTool from '../InteractionTool';

export enum BRUSH_STATE {
  DRAW = 'DRAW',
  RESET = 'RESET',
  MOVE = 'MOVE'
}

export interface BrushOptions extends ToolUseOptions {
  state?: BRUSH_STATE;
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

  override pointerMove(e: ToolPointerEvent) {
    super.pointerMove(e);
  }

  override async pointerMoveStatic(e: ToolPointerEvent) {
    this.action(
      {
        state: this.active ? BRUSH_STATE.DRAW : BRUSH_STATE.MOVE
      } as TOptions,
      { event: e }
    );
  }

  override async pointerDown(e: ToolPointerEvent) {
    await super.pointerDown(e);
    await this.app.actions.startStack();
    this.active = true;
    this.action(
      {
        state: BRUSH_STATE.DRAW
      } as TOptions,
      { event: e }
    );
  }

  override async pointerCancel(e: ToolPointerEvent) {
    this.active = false;
    this.action(
      {
        state: BRUSH_STATE.RESET
      } as TOptions,
      { event: e }
    );
    await super.pointerCancel(e);
  }

  override async pointerUp(e: ToolPointerEvent) {
    this.active = false;
    return super.pointerUp(e);
  }
}
