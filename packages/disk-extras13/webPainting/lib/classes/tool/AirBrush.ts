import { TOOLS } from '@web-workbench/disk-extras13/webPainting/types/select';
import Tool, {
  type ToolConstructorOptions,
  type ToolPointerEvent,
  type ToolUseOptions
} from '../Tool';
import type { Subscription } from 'rxjs';
import { timer } from 'rxjs';

export interface AirBrushOptions extends ToolUseOptions {
  /**
   * Interval in milliseconds for the press and hold functionality
   */
  holdInterval?: number;
  radius?: number;
  round?: boolean;
}

export default class AirBrush<
  TOptions extends AirBrushOptions = AirBrushOptions
> extends Tool<TOptions> {
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
        radius: 10,
        round: true
      }
    });
  }

  override pointerMove(e: ToolPointerEvent): void {
    super.pointerMove(e);
    this.holdEvent = e;
    this.action(e, this.options);
  }

  override async pointerDown(e: ToolPointerEvent): Promise<void> {
    await super.pointerDown(e);
    await this.startStack();
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
    await this.stopStack();
  }
}
