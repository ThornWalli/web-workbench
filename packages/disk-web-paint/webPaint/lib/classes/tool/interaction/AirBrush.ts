import { TOOL } from '../../../../types/select';
import type { ToolConstructorOptions } from '../../Tool';
import type { Subscription } from 'rxjs';
import { timer } from 'rxjs';
import InteractionTool from '../InteractionTool';
import type { InteractionOptions } from '../InteractionTool';
import ToolPointerEvent from '../../ToolPointerEvent';

export interface AirBrushOptions extends InteractionOptions {
  round?: boolean;
}

export default class AirBrush<
  TOptions extends AirBrushOptions = AirBrushOptions
> extends InteractionTool<TOptions> {
  private timer?: Subscription;
  holdEvent?: ToolPointerEvent;

  constructor(options: Omit<ToolConstructorOptions<TOptions>, 'type'>) {
    super({
      ...options,
      type: TOOL.AIR_BRUSH,
      options: {
        ...options.options,
        stackable: true,
        round: true
      }
    });
  }

  _pointerMove(e: ToolPointerEvent): void {
    super.pointerMove(e);

    this.action(
      {
        ...this.options
      },
      { event: e }
    );
  }

  override pointerMove(e: ToolPointerEvent): void {
    this.holdEvent = e;
  }

  override async pointerDown(e: ToolPointerEvent): Promise<void> {
    await super.pointerDown(e);
    await this.app.actions.startStack();

    this.timer = timer(
      0,
      this.app.options.select.tool.airBrushInterval
    ).subscribe(() => {
      this._pointerMove(
        new ToolPointerEvent({
          ...e,
          ...this.holdEvent,
          seed: undefined
        })
      );
    });
  }
  override async pointerUp(e: ToolPointerEvent): Promise<void> {
    if (this.timer) {
      this.timer.unsubscribe();
      this.timer = undefined;
      this.holdEvent = undefined;
    }
    await super.pointerUp(e);
    await this.app.actions.stopStack();
  }
}
