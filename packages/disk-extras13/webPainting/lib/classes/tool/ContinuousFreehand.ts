import { TOOLS } from '@web-workbench/disk-extras13/webPainting/types/select';
import type { ToolConstructorOptions, ToolPointerEvent } from '../Tool';
import { ipoint, type IPoint } from '@js-basics/vector';
import DottedFreehand, { type DottedFreehandOptions } from './DottedFreehand';

export interface ContinuousFreehandOptions extends DottedFreehandOptions {
  lastPosition: IPoint & number;
}

export default class ContinuousFreehand extends DottedFreehand<ContinuousFreehandOptions> {
  constructor(options: Omit<ToolConstructorOptions, 'type' | 'options'>) {
    super({
      ...options,
      type: TOOLS.CONTINUOUS_FREEHAND,
      options: {
        lastPosition: ipoint(0, 0)
      }
    });
  }
  override async pointerDown(e: ToolPointerEvent): Promise<void> {
    this.options.lastPosition = e.normalizedPosition;
    await super.pointerDown(e);
  }
  override pointerMove(e: ToolPointerEvent): void {
    super.pointerMove(e);
    this.options.lastPosition = e.normalizedPosition;
  }
  override async pointerUp(e: ToolPointerEvent): Promise<void> {
    this.options.lastPosition = e.normalizedPosition;
    return super.pointerUp(e);
  }
}
