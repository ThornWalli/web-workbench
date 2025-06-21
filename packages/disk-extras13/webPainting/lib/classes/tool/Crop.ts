import { TOOLS } from '@web-workbench/disk-extras13/webPainting/types/select';
import type {
  ToolConstructorOptions,
  ToolPointerEvent,
  ToolUseOptions
} from '../Tool';
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import { Color } from '../Color';

import Tool from '../Tool';

interface Bounds {
  position: IPoint & number;
  dimension: IPoint & number;
}

export enum CROP_STATE {
  START = 'START',
  MOVE = 'MOVE',
  STOP = 'STOP'
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

export interface CropOptions extends ToolUseOptions {
  state?: CROP_STATE;
  position: IPoint & number;
  dimension: IPoint & number;
  copy?: boolean;
}

export default class Crop extends Tool<CropOptions> {
  private bounds?: Bounds;
  color: Color = new Color(255, 0, 0, 255);
  moving: boolean = false;
  startEvent?: ToolPointerEvent;
  lastEvent?: ToolPointerEvent;
  moveOffset?: IPoint & number;

  constructor(options: Omit<ToolConstructorOptions<CropOptions>, 'type'>) {
    super({
      ...options,
      type: TOOLS.CROP,
      options: {
        ...options.options,
        stackable: true
      }
    });
  }

  override async pointerDown(e: ToolPointerEvent) {
    const intersected =
      (this.bounds && boundsIntersect(e.position, this.bounds)) || false;
    if (this.moving && this.bounds && !intersected) {
      await this.startStack();
      this.action(e, {
        state: CROP_STATE.STOP,
        stackable: true
      });
      await this.stopStack();
      this.reset(e);
    } else if (this.bounds && !this.moving && intersected) {
      this.moving = true;
      this.action(e, {
        state: CROP_STATE.START,
        stackable: false
      });
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

  override action(e: ToolPointerEvent, options: Partial<CropOptions>) {
    const offset = ipoint(() => Math.min(this.bounds!.dimension, 0));
    const position = ipoint(() => this.bounds!.position + offset);
    super.action(e, {
      position: e.normalizePosition(position),
      dimension: e.normalizeDimension(
        ipoint(() => Math.abs(this.bounds!.dimension))
      ),
      copy: this.domEvents.shiftActive,
      ...options
    });
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

    this.action(e, {
      state: CROP_STATE.MOVE,
      stackable: false
    });
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
    if (this.moving) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
      ctx.fillRect(
        this.bounds!.position.x,
        this.bounds!.position.y,
        this.bounds!.dimension.x,
        this.bounds!.dimension.y
      );
    }
    ctx.strokeRect(
      this.bounds!.position.x,
      this.bounds!.position.y,
      this.bounds!.dimension.x,
      this.bounds!.dimension.y
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
