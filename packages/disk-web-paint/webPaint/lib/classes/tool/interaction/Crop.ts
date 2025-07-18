import { TOOL } from '@web-workbench/disk-web-paint/webPaint/types/select';
import type { ToolConstructorOptions } from '../../Tool';
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import Color from '../../Color';
import InteractionTool from '../InteractionTool';
import type { InteractionOptions } from '../InteractionTool';
import type { IActionResult } from '@web-workbench/disk-web-paint/webPaint/types/worker';
import type { ClientIncomingAction } from '@web-workbench/disk-web-paint/webPaint/types/worker.message.client';
import type ToolPointerEvent from '../../ToolPointerEvent';
import { loadImage } from '@web-workbench/core/utils/image';

import SvgApply from '../../../../assets/svg/crop/apply.svg?url';
import SvgAbort from '../../../../assets/svg/crop/abort.svg?url';
interface Bounds {
  position: IPoint & number;
  dimension: IPoint & number;
}

export enum CROP_STATE {
  START = 'START',
  MOVE = 'MOVE',
  STOP = 'STOP',
  ABORT = 'ABORT'
}

function boundsIntersect(position: IPoint & number, bounds: Bounds): boolean {
  const offset = ipoint(() => Math.min(bounds.dimension, 0));
  const boundsPosition = ipoint(() => Math.round(bounds.position + offset));
  return (
    position.x >= boundsPosition.x &&
    position.x <= boundsPosition.x + Math.abs(bounds.dimension.x) &&
    position.y >= boundsPosition.y &&
    position.y <= boundsPosition.y + Math.abs(bounds.dimension.y)
  );
}

export interface CropOptions extends InteractionOptions {
  state?: CROP_STATE;
  position: IPoint & number;
  dimension: IPoint & number;
  cut?: boolean;
}

export default class Crop extends InteractionTool<CropOptions> {
  private bounds?: Bounds;
  color: Color = new Color(255, 0, 0, 255);
  moving: boolean = false;
  startEvent?: ToolPointerEvent;
  lastEvent?: ToolPointerEvent;
  moveOffset?: IPoint & number;

  constructor(options: Omit<ToolConstructorOptions<CropOptions>, 'type'>) {
    super({
      ...options,
      type: TOOL.CROP,
      options: {
        ...options.options,
        stackable: true
      }
    });
  }

  override cancel(e: ToolPointerEvent): void {
    this.reset(e);
  }

  images?: {
    apply: HTMLImageElement;
    abort: HTMLImageElement;
  };
  override async pointerDown(e: ToolPointerEvent) {
    this.images = this.images || {
      apply: await loadImage(SvgApply),
      abort: await loadImage(SvgAbort)
    };

    const intersected =
      (this.bounds && boundsIntersect(e.position, this.bounds)) || false;
    if (this.isIntersectingButton(e, BUTTON.APPLY)) {
      await this.app.actions.startStack();
      this.action(
        {
          state: CROP_STATE.STOP,
          stackable: true
        },
        { event: e }
      );
      await this.app.actions.stopStack();
      this.reset(e);
    } else if (this.isIntersectingButton(e, BUTTON.ABORT)) {
      this.action(
        {
          state: CROP_STATE.ABORT,
          stackable: true
        },
        { event: e }
      );
      this.reset(e);
      // } else if (this.moving && this.bounds && !intersected) {
      //   await this.app.actions.startStack();
      //   this.action(
      //     {
      //       state: CROP_STATE.STOP,
      //       stackable: true
      //     },
      //     { event: e }
      //   );
      //   await this.app.actions.stopStack();
      //   this.reset(e);
    } else if (this.bounds && !this.moving && intersected) {
      this.moving = true;
      this.action(
        {
          state: CROP_STATE.START,
          stackable: false
        },
        { event: e }
      );
    }
    if (!this.moving) {
      this.startEvent = e;
      this.lastEvent = undefined;
      await super.pointerDown(e);
    } else {
      this.moveOffset = ipoint(() => e.position - this.bounds!.position);
    }
    this.render(e);
  }

  override action<Result extends IActionResult = ClientIncomingAction>(
    options: Partial<CropOptions>,
    { event }: { event: ToolPointerEvent }
  ) {
    const offset = ipoint(() => Math.min(this.bounds!.dimension, 0));
    const position = ipoint(() => this.bounds!.position + offset);
    return super.action<Result>(
      {
        position: event.normalizePosition(position),
        dimension: event.normalizeDimension(
          ipoint(() => Math.abs(this.bounds!.dimension))
        ),
        cut: this.domEvents?.shiftActive || false,
        ...options
      },
      { event }
    );
  }

  override pointerMove(e: ToolPointerEvent) {
    if (!this.startEvent) {
      return;
    }

    if (!this.moving) {
      this.bounds = {
        position: e.unnormalizePosition(
          e.fixedPosition(this.startEvent.position)
        ),
        dimension: e.unnormalizeDimension(
          e.fixedDimension(ipoint(() => e.position - this.startEvent!.position))
        )
      };

      this.lastEvent = e;
    } else {
      this.bounds!.position = e.unnormalizePosition(
        e.fixedPosition(ipoint(() => e.position - this.moveOffset!))
      );
    }
    this.render(e);

    this.action(
      {
        state: CROP_STATE.MOVE,
        stackable: false
      },
      { event: e }
    );
  }

  render(e: ToolPointerEvent) {
    if (!this.bounds) {
      return;
    }

    const ctx = e.ctx;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = `dotted ${this.color.toHex()}`;
    ctx.lineWidth = 1;
    ctx.setLineDash([6]);
    ctx.strokeRect(
      this.bounds!.position.x,
      this.bounds!.position.y,
      this.bounds!.dimension.x,
      this.bounds!.dimension.y
    );

    if (this.moving) {
      ctx.fillStyle = 'white';
      const size = 32;
      const x =
        this.bounds!.position.x + Math.max(this.bounds!.dimension.x, 0) - size;
      const y =
        this.bounds!.position.y + Math.max(this.bounds!.dimension.y, 0) - size;
      ctx.fillRect(x - size, y, size * 2, size);

      if (this.images) {
        ctx.drawImage(
          this.images.apply,
          x + (size - 18) / 2,
          y + (size - 18) / 2,
          18,
          18
        );
        ctx.drawImage(
          this.images.abort,
          x + (size - 18) / 2 - size,
          y + (size - 18) / 2,
          18,
          18
        );
      }
    }
  }

  isIntersectingButton(e: ToolPointerEvent, button: BUTTON = BUTTON.APPLY) {
    if (!this.bounds) {
      return false;
    }
    let x = this.bounds.position.x + Math.max(this.bounds.dimension.x, 0) - 32;
    const y =
      this.bounds.position.y + Math.max(this.bounds.dimension.y, 0) - 32;

    if (button === BUTTON.ABORT) {
      x -= 32;
    }

    return (
      e.position.x >= x &&
      e.position.x <= x + 32 &&
      e.position.y >= y &&
      e.position.y <= y + 32
    );
  }

  override reset(e: ToolPointerEvent): void {
    super.reset(e);
    this.bounds = undefined;
    this.moving = false;
    this.startEvent = undefined;
    this.lastEvent = undefined;
    this.moveOffset = undefined;
  }
}

enum BUTTON {
  APPLY = 'apply',
  ABORT = 'abort'
}
