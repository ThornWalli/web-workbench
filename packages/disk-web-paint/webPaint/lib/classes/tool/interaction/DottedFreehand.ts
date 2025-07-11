import { TOOLS } from '@web-workbench/disk-web-paint/webPaint/types/select';
import Brush from './Brush';
import type { BrushOptions } from './Brush';
import type { ToolConstructorOptions, ToolPointerEvent } from '../../Tool';
import type { Subscription } from 'rxjs';
import { timer } from 'rxjs';

export interface DottedFreehandOptions extends BrushOptions {
  /**
   * Interval in milliseconds for the press and hold functionality
   */
  holdInterval?: number;
}

export default class DottedFreehand<
  TOptions extends DottedFreehandOptions = DottedFreehandOptions
> extends Brush<TOptions> {
  private timer?: Subscription;
  /**
   * Indicates if the tool can use press and hold functionality.
   */
  canPressHold: boolean;
  holdEvent?: ToolPointerEvent;
  constructor(options: ToolConstructorOptions<TOptions>) {
    super({
      ...options,
      type: options.type || TOOLS.DOTTED_FREEHAND,
      options: {
        ...options.options,
        holdInterval: options.options?.holdInterval || 20
      }
    });

    // Check if the brush type is Dots, which allows press and hold functionality
    this.canPressHold = false;
    // options.app.options.select.brush?.type === BRUSH_TYPE.DOTS;
  }
  override async pointerDown(e: ToolPointerEvent): Promise<void> {
    await super.pointerDown(e);
    if (this.canPressHold) {
      if (!this.options.holdInterval) {
        throw new Error(
          'Hold interval must be defined for DottedFreehand tool.'
        );
      }
      this.timer = timer(0, this.options.holdInterval).subscribe(() => {
        this.pointerMove({
          ...e,
          ...this.holdEvent
        });
      });
    }
  }

  override pointerMove(e: ToolPointerEvent): void {
    if (this.canPressHold) {
      this.holdEvent = e;
    }
    super.pointerMove(e);
  }

  override async pointerUp(e: ToolPointerEvent) {
    if (this.timer) {
      this.timer.unsubscribe();
      this.timer = undefined;
      this.holdEvent = undefined;
    }
    return super.pointerUp(e);
  }
}
