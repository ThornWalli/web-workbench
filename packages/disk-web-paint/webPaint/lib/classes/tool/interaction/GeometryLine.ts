import type { ToolConstructorOptions, ToolEvent } from '../../Tool';
import Anchor from '../../Anchor';
import { ipoint } from '@js-basics/vector';
import type { IPoint } from '@js-basics/vector';
import InteractionTool from '../InteractionTool';
import type { InteractionOptions } from '../InteractionTool';
import type ToolPointerEvent from '../../ToolPointerEvent';

export enum GEOMETRY_LINE_STATE {
  START = 'start',
  MOVE = 'move',
  STOP = 'stop'
}

export interface GeometryLineOptions extends InteractionOptions {
  state?: GEOMETRY_LINE_STATE;
}

export default class GeometryLine<
  TOptions extends GeometryLineOptions = GeometryLineOptions
> extends InteractionTool<TOptions> {
  startEvent?: ToolPointerEvent;
  selectedAnchor?: Anchor;
  anchors: Anchor[];

  constructor(options: ToolConstructorOptions<TOptions>) {
    super({
      ...options,
      options: {
        ...options.options,
        stackable: true
      }
    });
    this.selectedAnchor = undefined;
    this.anchors = [];
  }

  override async pointerDown(e: ToolPointerEvent) {
    await super.pointerDown(e);
    this.startEvent = e;
  }

  override cancel(e: ToolEvent): void {
    super.cancel(e);
    this.reset(e);
  }

  // #region Anchors

  drawAnchors(
    e: ToolPointerEvent,
    options: { stroke?: boolean } = { stroke: true }
  ) {
    this.anchors.forEach(anchor => {
      this.drawAnchor(e, anchor, options);
    });
  }

  drawAnchor(
    e: ToolPointerEvent,
    anchor: Anchor,
    {
      stroke
    }: {
      stroke?: boolean;
    } = { stroke: true }
  ) {
    e.ctx.lineWidth = 1;
    e.ctx.fillStyle =
      this.app.options.select.color.secondaryColor.color.toHex();
    if (anchor === this.selectedAnchor || !stroke) {
      e.ctx.fillStyle = this.app.options.select.color.primaryColor.color
        .toInverted()
        .toHex();
    }
    e.ctx.strokeStyle =
      this.app.options.select.color.primaryColor.color.toHex();

    const position = ipoint(() =>
      Math.round(anchor.position - anchor.dimension / 2)
    );

    e.ctx.fillRect(
      position.x,
      position.y,
      anchor.dimension.x,
      anchor.dimension.y
    );
    e.ctx.strokeRect(
      position.x,
      position.y,
      anchor.dimension.x,
      anchor.dimension.y
    );
  }

  getAnchorByPosition(position: IPoint & number) {
    return this.anchors.find(anchor => {
      if (anchor.intersect(position)) {
        return anchor;
      }
      return false;
    });
  }

  addAnchor(position: IPoint & number) {
    const anchor = new Anchor(position);
    this.anchors.push(anchor);
    return anchor;
  }

  override reset(e: ToolEvent) {
    super.reset(e);
    this.anchors = [];
    this.selectedAnchor = undefined;
  }

  // #endregion
}
