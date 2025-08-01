/* eslint-disable complexity */
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import type { ToolConstructorOptions } from '../Tool';
import InteractionTool from './InteractionTool';
import type { InteractionOptions } from './InteractionTool';
import type ToolPointerEvent from '../ToolPointerEvent';
import Color from '../Color';

import SvgTopLeft from '../../../assets/svg/image_edge/top_left.svg?url';
import SvgTopRight from '../../../assets/svg/image_edge/top_right.svg?url';
import SvgBottomLeft from '../../../assets/svg/image_edge/bottom_left.svg?url';
import SvgBottomRight from '../../../assets/svg/image_edge/bottom_right.svg?url';
import SvgApply from '../../../assets/svg/crop/apply.svg?url';
import SvgAbort from '../../../assets/svg/crop/abort.svg?url';

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

enum BUTTON {
  APPLY = 'apply',
  ABORT = 'abort'
}

export enum EDGE {
  NONE = 'none',
  TOP_LEFT = 'top_left',
  TOP_RIGHT = 'top_right',
  BOTTOM_LEFT = 'bottom_left',
  BOTTOM_RIGHT = 'bottom_right'
}

export interface BaseButtonDescription<TButton> {
  type: TButton;
  image: HTMLCanvasElement | HTMLImageElement | undefined;
  click: (e: ToolPointerEvent) => void;
}

export type ButtonDescription = BaseButtonDescription<BUTTON>;

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

export interface PlacementOptions<T = PLACEMENT_STATE>
  extends InteractionOptions {
  state?: T;
  resize?: boolean;
  position: IPoint & number;
  dimension: IPoint & number;
  square?: boolean;
}

export default class PlacementTool<
  TState = PLACEMENT_STATE,
  TOptions extends PlacementOptions<TState> = PlacementOptions<TState>,
  TButton extends string = BUTTON,
  TImages extends Images = Images,
  TButtonDescription extends
    BaseButtonDescription<TButton> = BaseButtonDescription<TButton>
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
  private buttonSize: number = 32;
  private buttonGap: number = 16;

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
  isIntersectEdge(position: IPoint & number) {
    const size = this.buttonSize;
    if (!this.bounds) {
      return EDGE.NONE;
    }
    const offset = ipoint(() => Math.min(this.bounds.dimension, 0));
    const boundsPosition = ipoint(() =>
      Math.round(this.bounds.position + offset)
    );
    if (
      position.x >= boundsPosition.x - size &&
      position.x <=
        boundsPosition.x + Math.abs(this.bounds.dimension.x) + size &&
      position.y >= boundsPosition.y - size &&
      position.y <= boundsPosition.y + Math.abs(this.bounds.dimension.y) + size
    ) {
      if (
        position.x <= boundsPosition.x + size &&
        position.y <= boundsPosition.y + size
      ) {
        return EDGE.TOP_LEFT;
      } else if (
        position.x >=
          boundsPosition.x + Math.abs(this.bounds.dimension.x) - size &&
        position.y <= boundsPosition.y + size
      ) {
        return EDGE.TOP_RIGHT;
      } else if (
        position.x <= boundsPosition.x + size &&
        position.y >=
          boundsPosition.y + Math.abs(this.bounds.dimension.y) - size
      ) {
        return EDGE.BOTTOM_LEFT;
      } else if (
        position.x >=
          boundsPosition.x + Math.abs(this.bounds.dimension.x) - size &&
        position.y >=
          boundsPosition.y + Math.abs(this.bounds.dimension.y) - size
      ) {
        return EDGE.BOTTOM_RIGHT;
      }
    }
    return EDGE.NONE;
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
      position.x >= boundsPosition.x + this.buttonSize &&
      position.x <=
        boundsPosition.x +
          Math.abs(this.bounds.dimension.x) -
          this.buttonSize &&
      position.y >= boundsPosition.y + this.buttonSize &&
      position.y <=
        boundsPosition.y + Math.abs(this.bounds.dimension.y) - this.buttonSize
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

  images?: TImages;

  edge: EDGE = EDGE.NONE;

  prepareImage(path) {
    return loadImage(path).then(image => {
      return overrideFill(image, this.colors.foreground.toHex());
    });
  }

  loadImages(): Promise<TImages> {
    return Promise.all(
      [
        SvgTopLeft,
        SvgTopRight,
        SvgBottomLeft,
        SvgBottomRight,
        SvgApply,
        SvgAbort
      ].map(url => this.prepareImage(url))
    ).then(images => {
      return {
        top_left: images[0],
        top_right: images[1],
        bottom_left: images[2],
        bottom_right: images[3],
        apply: images[4],
        abort: images[5]
      } as TImages;
    });
  }

  override async pointerDown(e: ToolPointerEvent) {
    this.images = this.images || (await this.loadImages());

    // this.edge = EDGE.NONE;
    this.lastBounds = this.bounds;
    this.startEvent = e;
    if (!this.bounds) {
      this.isResize = true;
      this.edge = EDGE.BOTTOM_RIGHT;
    } else if (this.isIntersect(e.position)) {
      this.isMove = true;
      this.moveOffset = ipoint(() => e.position - this.bounds.position);
    }

    // this.edge = EDGE.NONE;
    // if (!this.bounds) {
    //   this.isResize = true;
    //   this.edge = EDGE.BOTTOM_RIGHT;
    // } else if (this.intersectionButtonContainer(e)) {
    //   const button = this.intersectButton(e);
    //   button.click(e);
    // } else if (this.isIntersect(e.position)) {
    //   this.isMove = true;
    //   this.moveOffset = ipoint(() => e.position - this.bounds.position);
    // } else {
    //   // this.edge = this.resizeable
    //   //   ? this.isIntersectEdge(e.position)
    //   //   : EDGE.NONE;
    //   // if (this.edge !== EDGE.NONE) {
    //   //   this.isResize = true;
    //   //   this.moveOffset = ipoint(() => e.position - this.bounds.position);
    //   // } else {
    //   this.reset(e);
    //   // }
    // }
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

  drawButtons(_ctx: CanvasRenderingContext2D) {
    if (!this.images) {
      return;
    }

    const position = this.buttonContainerPosition;

    _ctx.fillStyle = this.colors.background.toHex();
    _ctx.fillRect(
      position.x,
      position.y,
      this.buttonContainerDimension.x,
      this.buttonContainerDimension.y
    );

    const buttons = this.getButtons();
    buttons.forEach(({ image }, index) => {
      if (!image) {
        return;
      }
      let x = position.x + this.buttonSize * index;
      const y = position.y;
      x += this.buttonGap * index;
      _ctx.drawImage(
        image,
        x + (this.buttonSize - image.width) / 2,
        y + (this.buttonSize - image.height) / 2,
        image.width,
        image.height
      );
    });
  }

  get buttonContainerDimension() {
    return ipoint(
      this.buttonSize * this.getButtons().length +
        this.buttonGap * (this.getButtons().length - 1),
      this.buttonSize
    );
  }
  get buttonContainerPosition() {
    const offset = ipoint(
      (this.bounds!.dimension.x - this.buttonContainerDimension.x) / 2,
      this.bounds!.dimension.y
    );
    const position = ipoint(() => this.bounds!.position + offset);

    return position;
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

  getButtons(): TButtonDescription[] {
    return [
      {
        type: BUTTON.ABORT,
        image: this.images?.abort,
        click: this.onClickAbort.bind(this)
      },
      {
        type: BUTTON.APPLY,
        image: this.images?.apply,
        click: this.onClickApply.bind(this)
      }
    ] as TButtonDescription[];
  }

  intersectionButtonContainer(e: ToolPointerEvent) {
    const position = this.buttonContainerPosition;
    const size = this.buttonSize;
    const buttons = this.getButtons();
    return (
      e.position.x >= position.x &&
      e.position.x <=
        position.x +
          size * buttons.length +
          (buttons.length - 1) * this.buttonGap &&
      e.position.y >= position.y &&
      e.position.y <= position.y + size
    );
  }

  intersectButton(e: ToolPointerEvent) {
    const position = this.buttonContainerPosition;
    const size = this.buttonSize;
    const buttons = this.getButtons();

    const button = buttons.find((button, index) => {
      const x = position.x + size * index + index * this.buttonGap;
      const y = position.y;
      if (
        e.position.x >= x &&
        e.position.x <= x + size &&
        e.position.y >= y &&
        e.position.y <= y + size
      ) {
        return button;
      }
    });

    return button;
  }

  drawEdges(ctx: CanvasRenderingContext2D) {
    const { dimension } = this.bounds;

    const edgePositionPos = ipoint(() => Math.sign(Math.max(dimension, 0)));
    const edgePositionNeg = ipoint(
      () => Math.sign(Math.min(dimension, 0)) * -1
    );

    const edges = [
      {
        image: this.images.top_left,
        position: ipoint(edgePositionNeg.x, edgePositionNeg.y),
        offset: ipoint(0, 0)
      },
      {
        image: this.images.top_right,
        position: ipoint(edgePositionPos.x, edgePositionNeg.y),
        offset: ipoint(1, 0)
      },
      {
        image: this.images.bottom_left,
        position: ipoint(edgePositionNeg.x, edgePositionPos.y),
        offset: ipoint(0, 1)
      },
      {
        image: this.images.bottom_right,
        position: ipoint(edgePositionPos.x, edgePositionPos.y),
        offset: ipoint(1, 1)
      }
    ];

    edges.forEach(({ image, position, offset }) => {
      ctx.drawImage(
        image,
        this.bounds.position.x +
          dimension.x * position.x -
          image.width * offset.x,
        this.bounds.position.y +
          dimension.y * position.y -
          image.height * offset.y,
        image.width,
        image.height
      );
    });
  }

  onClickEdge(e, edge: EDGE) {
    this.edge = edge;
    this.isResize = true;
    this.moveOffset = ipoint(() => e.position - this.bounds.position);
    console.log('onClickEdge', edge, this.moveOffset, this.bounds.position);
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
