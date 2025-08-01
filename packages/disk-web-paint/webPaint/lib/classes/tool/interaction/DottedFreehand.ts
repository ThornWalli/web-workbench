import { TOOL } from '../../../../types/select';
import Brush from './Brush';
import type { BrushOptions } from './Brush';
import type { ToolConstructorOptions } from '../../Tool';
import type { Subscription } from 'rxjs';
import type ToolPointerEvent from '../../ToolPointerEvent';

export interface DottedFreehandOptions extends BrushOptions {
  /**
   * Abstand zwischen den Brushes.
   */
  gap?: number;
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
      type: options.type || TOOL.DOTTED_FREEHAND,
      options: {
        ...options.options,
        gap:
          options.options?.gap || options.app.options.select.tool.dottedGap || 2
      }
    });
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
