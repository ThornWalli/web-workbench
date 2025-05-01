import type App from '../App';
import type Color from '../Color';
import type Display from '../Display';
import type ExtendedPointerEvent from '../ExtendedPointerEvent';
import type Mouse from '../input/Mouse';
import type { PointerResult, PointerOptions } from '../types';

export interface ToolOptions {
  app: App;
  passive?: boolean;
  pointerDownHold?: boolean;
}

interface ITool {
  app: App;
  passive: boolean;
  pointerDownHold: boolean;
  deconstructor(): void;
  onActive(): void;
  onPointerDown(
    e?: ExtendedPointerEvent,
    options?: PointerOptions
  ): PointerResult;
  onPointerUp(
    e?: ExtendedPointerEvent,
    options?: PointerOptions
  ): PointerResult;
  onPointerMove(
    e?: ExtendedPointerEvent,
    options?: PointerOptions
  ): PointerResult;
  onContextMenu(e?: Event, options?: PointerOptions): PointerResult;
}

export default class Tool implements ITool {
  app: App;
  passive: boolean;
  pointerDownHold: boolean = false;

  constructor({ app, passive, pointerDownHold }: ToolOptions) {
    this.app = app;
    this.passive = passive || false;
    this.pointerDownHold = pointerDownHold || false;
  }
  onPointerDown(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    e?: ExtendedPointerEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: { mouse?: Mouse; display?: Display }
  ): PointerResult {
    throw new Error('Method "onPointerDown" not implemented.');
  }

  onPointerUp(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    e?: ExtendedPointerEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: { mouse?: Mouse; display?: Display }
  ): PointerResult {
    throw new Error('Method "onPointerUp" not implemented.');
  }

  onPointerMove(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    e?: ExtendedPointerEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: { mouse?: Mouse; display?: Display }
  ): PointerResult {
    throw new Error('Method "onPointerMove" not implemented.');
  }

  onContextMenu(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    e?: Event,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: { mouse?: Mouse; display?: Display }
  ): PointerResult {
    throw new Error('Method "onContextMenu" not implemented.');
  }

  deconstructor() {
    /* empty */
  }

  onActive() {
    /* empty */
  }

  setPixel(x: number, y: number, color: Color) {
    return this.app.canvas?.setPixel(x, y, color);
  }
}
