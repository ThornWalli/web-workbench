import { TOOLS } from '@web-workbench/disk-extras13/webPaint/types/select';
import type {
  ToolConstructorOptions,
  ToolPointerEvent,
  ToolUseOptions
} from '../../Tool';
import type { Subscription } from 'rxjs';
import { timer } from 'rxjs';
import InteractionTool from '../InteractionTool';

export interface AirBrushOptions extends ToolUseOptions {
  /**
   * Interval in milliseconds for the press and hold functionality
   */
  holdInterval?: number;
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
      type: TOOLS.AIR_BRUSH,
      options: {
        ...options.options,
        stackable: true,
        holdInterval: options.options?.holdInterval || 20,
        round: true
      }
    });
  }

  override pointerMove(e: ToolPointerEvent): void {
    super.pointerMove(e);
    this.holdEvent = e;
    this.action(this.options, { event: e });
  }

  override async pointerDown(e: ToolPointerEvent): Promise<void> {
    await super.pointerDown(e);
    await this.app.actions.startStack();
    // this.action(e, this.options);

    if (!this.options.holdInterval) {
      throw new Error('Hold interval must be defined for DottedFreehand tool.');
    }
    this.timer = timer(0, this.options.holdInterval).subscribe(() => {
      this.pointerMove({
        ...e,
        ...this.holdEvent
      });
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
