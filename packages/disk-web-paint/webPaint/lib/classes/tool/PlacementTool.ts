/* eslint-disable complexity */
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import type { ToolConstructorOptions } from '../Tool';
import InteractionTool from './InteractionTool';
import type { InteractionOptions } from './InteractionTool';
import type ToolPointerEvent from '../ToolPointerEvent';
import Color from '@web-workbench/core/classes/Color';

import { loadImage } from '@web-workbench/core/utils/image';
import type { ClientIncomingAction } from '../../../types/worker.message.client';
import type { IActionResult } from '../../../types/worker';

export interface Images {
  top_left: HTMLCanvasElement;
  top_right: HTMLCanvasElement;
  bottom_left: HTMLCanvasElement;
  bottom_right: HTMLCanvasElement;
  apply: HTMLCanvasElement;
  abort: HTMLCanvasElement;
}

export enum EDGE {
  NONE = 'none',
  TOP_LEFT = 'top_left',
  TOP_RIGHT = 'top_right',
  BOTTOM_LEFT = 'bottom_left',
  BOTTOM_RIGHT = 'bottom_right'
}

interface Bounds {
  position: IPoint & number;
  dimension: IPoint & number;
}

export enum PLACEMENT_STATE {
  ABORT = 'ABORT',
  START = 'START',
  MOVE = 'MOVE',
  STOP = 'STOP'
}

export interface PlacementOptions<
  T = PLACEMENT_STATE
> extends InteractionOptions {
  state?: T;
  resize?: boolean;
  position: IPoint & number;
  dimension: IPoint & number;
  square?: boolean;
}

export default class PlacementTool<
  TState = PLACEMENT_STATE,
  TOptions extends PlacementOptions<TState> = PlacementOptions<TState>
> extends InteractionTool<TOptions> {
  public bounds: Bounds = null;
  private lastBounds: Bounds = null;
  public startEvent?: ToolPointerEvent;

  public resizeable: boolean = true;
  private resizeableAfterMove: boolean = false;
  public isResize: boolean = true; // needs Initial
  public isMove: boolean = false;
  private color: Color = new Color(0, 0, 0, 255);
  private colors: {
    background: Color;
    foreground: Color;
  } = {
    background: new Color(0, 0, 0, 255),
    foreground: new Color(255, 255, 255, 255)
  };

  constructor(options: ToolConstructorOptions<TOptions>) {
    super({
      ...options,
      options: {
        ...options.options,
        stackable: true,
        position: ipoint(0, 0),
        dimension: ipoint(0, 0)
      }
    });
    this.resizeableAfterMove = options.resizeableAfterMove ?? true;
  }

  isIntersect(position: IPoint & number) {
    if (!this.bounds) {
      return false;
    }
    const offset = ipoint(() => Math.min(this.bounds.dimension, 0));
    const boundsPosition = ipoint(() =>
      Math.round(this.bounds.position + offset)
    );
    return (
      position.x >= boundsPosition.x &&
      position.x <= boundsPosition.x + Math.abs(this.bounds.dimension.x) &&
      position.y >= boundsPosition.y &&
      position.y <= boundsPosition.y + Math.abs(this.bounds.dimension.y)
    );
  }

  override reset(e: ToolPointerEvent) {
    super.reset(e);
    this.bounds = undefined;
    this.lastBounds = undefined;
    this.startEvent = undefined;
    this.isResize = true;
    this.isMove = false;
    this.moveOffset = undefined;
    this.edge = EDGE.NONE;
    this.resizeable = true;
    const { ctx } = e;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  override async pointerUp(e: ToolPointerEvent) {
    this.isResize = false;
    this.isMove = false;
    this.edge = EDGE.NONE;
    this.render(e);
    return super.pointerUp(e);
  }

  // PointerDown

  edge: EDGE = EDGE.NONE;

  prepareImage(path) {
    return loadImage(path).then(image => {
      return overrideFill(image, this.colors.foreground.toHex());
    });
  }

  override async pointerDown(e: ToolPointerEvent) {
    this.lastBounds = this.bounds;
    this.startEvent = e;
    if (!this.bounds) {
      this.isResize = true;
      this.edge = EDGE.BOTTOM_RIGHT;
    } else if (this.isIntersect(e.position)) {
      this.isMove = true;
      this.moveOffset = ipoint(() => e.position - this.bounds.position);
    }
    this.action(
      {
        state: PLACEMENT_STATE.START,
        stackable: false
      } as TOptions,
      { event: e }
    );
  }

  override action<Result extends IActionResult = ClientIncomingAction>(
    options: Partial<TOptions>,
    { event }: { event: ToolPointerEvent }
  ) {
    const dimension = this.bounds?.dimension ?? ipoint(0, 0);
    const offset = ipoint(() => Math.min(dimension, 0));
    const position = ipoint(
      () => (this.bounds?.position ?? ipoint(0, 0)) + offset
    );
    return super.action<Result>(
      {
        position: event.normalizePosition(position),
        dimension: event.normalizeDimension(ipoint(() => Math.abs(dimension))),
        ...options
      },
      { event }
    );
  }

  moveOffset: IPoint & number = ipoint(0, 0);

  override pointerMove(e: ToolPointerEvent) {
    if (!this.startEvent) {
      return;
    }
    if (this.isMove) {
      if (!this.resizeableAfterMove) {
        this.resizeable = false;
      }
      const position = ipoint(
        () => e.getPosition(this.options.clamp) - this.moveOffset
      );
      this.bounds.position = e.unnormalizePosition(e.fixedPosition(position));
    } else if (this.isResize) {
      const position = e.getPosition(this.options.clamp);

      const startPosition =
        this.lastBounds?.position ||
        this.startEvent!.getPosition(this.options.clamp);

      let boundsPosition, boundsDimension;
      switch (this.edge) {
        case EDGE.TOP_LEFT:
          boundsPosition = e.unnormalizePosition(
            e.fixedPosition(
              ipoint(
                this.lastBounds.position.x + (position.x - startPosition.x),
                this.lastBounds.position.y + (position.y - startPosition.y)
              )
            )
          );
          boundsDimension = e.unnormalizeDimension(
            e.fixedDimension(
              ipoint(
                this.lastBounds.dimension.x - (position.x - startPosition.x),
                this.lastBounds.dimension.y - (position.y - startPosition.y)
              )
            )
          );
          break;
        case EDGE.TOP_RIGHT:
          boundsPosition = e.unnormalizePosition(
            e.fixedPosition(
              ipoint(
                this.lastBounds.position.x,
                this.lastBounds.position.y + (position.y - startPosition.y)
              )
            )
          );
          boundsDimension = e.unnormalizeDimension(
            e.fixedDimension(
              ipoint(
                position.x - startPosition.x,
                this.lastBounds.dimension.y - (position.y - startPosition.y)
              )
            )
          );
          break;
        case EDGE.BOTTOM_LEFT:
          boundsPosition = e.unnormalizePosition(
            e.fixedPosition(
              ipoint(
                this.lastBounds.position.x + (position.x - startPosition.x),
                this.lastBounds.position.y
              )
            )
          );
          boundsDimension = e.unnormalizeDimension(
            e.fixedDimension(
              ipoint(
                this.lastBounds.dimension.x - (position.x - startPosition.x),
                position.y - startPosition.y
              )
            )
          );
          break;
        case EDGE.BOTTOM_RIGHT:
          boundsPosition = e.unnormalizePosition(
            e.fixedPosition(startPosition)
          );
          boundsDimension = e.unnormalizeDimension(
            e.fixedDimension(ipoint(() => position - startPosition))
          );
          break;
      }
      if (this.edge !== EDGE.NONE) {
        if (this.options.square) {
          boundsDimension = ipoint(
            boundsDimension.x,
            Math.abs(boundsDimension.x) * (boundsDimension.y < 0 ? -1 : 1)
          );
        }
        this.bounds = {
          position: e.unnormalizePosition(e.fixedPosition(boundsPosition)),
          dimension: e.unnormalizeDimension(e.fixedDimension(boundsDimension))
        };
        this.fixBounds();
      }
    }
    this.render(e);

    if (this.bounds) {
      window.clearTimeout(this.actionTimeout);
      this.actionTimeout = window.setTimeout(() => {
        this.action(
          {
            state: PLACEMENT_STATE.MOVE,
            resize: this.isResize,
            stackable: false,
            position: e.normalizePosition(this.bounds.position),
            dimension: e.normalizeDimension(this.bounds.dimension)
          } as TOptions,
          { event: e }
        );
      }, 1000 / 60);
    }
  }
  actionTimeout?: number;

  fixBounds() {
    if (!this.bounds) {
      return;
    }

    if (this.bounds.dimension.x < 0) {
      this.bounds.dimension = ipoint(
        Math.abs(this.bounds.dimension.x),
        this.bounds.dimension.y
      );
      this.bounds.position = ipoint(
        this.bounds.position.x - this.bounds.dimension.x,
        this.bounds.position.y
      );
    }
    if (this.bounds.dimension.y < 0) {
      this.bounds.dimension = ipoint(
        this.bounds.dimension.x,
        Math.abs(this.bounds.dimension.y)
      );
      this.bounds.position = ipoint(
        this.bounds.position.x,
        this.bounds.position.y - this.bounds.dimension.y
      );
    }
  }

  render(e: ToolPointerEvent) {
    if (!this.bounds) {
      return;
    }

    const ctx = e.ctx;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = `${this.color.toHex()}`;
    ctx.lineWidth = 1;
    ctx.setLineDash([6]);
    ctx.strokeRect(
      this.bounds!.position.x,
      this.bounds!.position.y,
      this.bounds!.dimension.x,
      this.bounds!.dimension.y
    );

    // this.drawInfoText(ctx, e);

    // if (this.resizeable) {
    //   this.drawEdges(ctx);
    // }
    // this.drawButtons(ctx);
  }

  drawInfoText(ctx: CanvasRenderingContext2D, e: ToolPointerEvent) {
    const realPosition = e.positionToRealPosition(
      e.normalizePosition(this.bounds!.position)
    );
    const realDimension = e.dimensionToRealDimension(
      e.normalizeDimension(this.bounds!.dimension)
    );

    const position = ipoint(10, 10);
    const padding = 4;
    const fontSize = 10;
    const lineHeight = 14;
    ctx.font = fontSize + 'px BitFont';
    ctx.letterSpacing = '1px';

    const text = [
      `Pos.: ${Math.round(realPosition.x)},${Math.round(realPosition.y)}`,
      `Dim.: ${Math.round(realDimension.x)},${Math.round(realDimension.y)}`
    ].map(text => {
      return {
        text,
        metric: ctx.measureText(text)
      };
    });

    let dimension = text.reduce(
      (acc, { metric }) => {
        return ipoint(Math.max(acc.x, metric.width), acc.y + lineHeight);
      },
      ipoint(0, 0)
    );

    dimension = ipoint(() => dimension + padding);

    ctx.fillStyle = this.colors.background.toHex();
    ctx.fillRect(position.x, position.y, dimension.x, dimension.y);

    ctx.fillStyle = this.colors.foreground.toHex();

    text.forEach(({ text }, index) => {
      ctx.fillText(
        text,
        position.x + padding,
        position.y + padding + index * lineHeight + 10
      );
    });

    return { position, dimension };
  }

  onClickAbort(e: ToolPointerEvent) {
    this.action(
      {
        state: PLACEMENT_STATE.ABORT,
        stackable: true
      } as TOptions,
      { event: e }
    );
    this.reset(e);
  }
  onClickApply(e: ToolPointerEvent) {
    this.action(
      {
        state: PLACEMENT_STATE.STOP,
        stackable: true,
        position: e.normalizePosition(this.bounds.position),
        dimension: e.normalizeDimension(this.bounds.dimension)
      } as TOptions,
      { event: e }
    );
    this.reset(e);
  }

  onClickEdge(e, edge: EDGE) {
    this.edge = edge;
    this.isResize = true;
    this.moveOffset = ipoint(() => e.position - this.bounds.position);
  }
}

function overrideFill(image: HTMLImageElement, color: string) {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }
  ctx.fillStyle = color;
  ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(image, 0, 0);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillRect(0, 0, image.width, image.height);
  ctx.globalCompositeOperation = 'source-over';
  return canvas;
}
