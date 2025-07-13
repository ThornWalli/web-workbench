import type { IPoint } from '@js-basics/vector';
import type { ToolConstructorOptions, ToolEvent } from '../../Tool';
import GeometryLine, { GEOMETRY_LINE_STATE } from './GeometryLine';
import type { GeometryLineOptions } from './GeometryLine';
import { TOOL } from '@web-workbench/disk-web-paint/webPaint/types/select';
import type ToolPointerEvent from '../../ToolPointerEvent';

export interface StraightLineOptions extends GeometryLineOptions {
  anchorDimension?: IPoint & number;
  anchorPositions?: (IPoint & number)[];
}

export default class StraightLine extends GeometryLine<StraightLineOptions> {
  lineWidth: number = 2;
  started = false;

  constructor(options: ToolConstructorOptions<StraightLineOptions>) {
    super({ ...options, type: TOOL.STRAIGHT_LINE });
  }

  override async pointerDown(e: ToolPointerEvent) {
    await super.pointerDown(e);
    if (this.selectedAnchor) {
      const selectedAnchor = this.getAnchorByPosition(e.position);
      if (selectedAnchor) {
        this.selectedAnchor = selectedAnchor;
      } else {
        await this.app.actions.startStack();
        await this.action(
          {
            state: GEOMETRY_LINE_STATE.STOP,
            anchorDimension: e.normalizeDimension(this.anchors[0].dimension),
            anchorPositions: this.anchors.map(anchor =>
              e.normalizePosition(anchor.position)
            )
          },
          { event: e }
        );
        await this.app.actions.stopStack();
        this.reset(e);
      }
    } else {
      this.action(
        {
          state: GEOMETRY_LINE_STATE.START,
          stackable: false
        },
        { event: e }
      );
      this.started = true;
    }
    this.render(e);
  }

  override async pointerMove(e: ToolPointerEvent) {
    if (!this.started) return;
    await super.pointerMove(e);
    if (this.domEvents?.pointerActive) {
      if (this.anchors.length < 1) {
        this.addAnchor(e.position);
        this.selectedAnchor = this.addAnchor(e.position);
      }
      if (this.selectedAnchor) {
        this.selectedAnchor.position = e.position;
      }
      this.render(e);

      this.action(
        {
          stackable: false,
          state: GEOMETRY_LINE_STATE.MOVE,
          anchorDimension: e.normalizeDimension(this.anchors[0].dimension),
          anchorPositions: this.anchors.map(anchor =>
            e.normalizePosition(anchor.position)
          )
        },
        { event: e }
      );
    }
  }

  override reset(e: ToolEvent | ToolPointerEvent): void {
    super.reset(e);
    this.started = false;
  }

  render(e: ToolPointerEvent) {
    e.ctx.clearRect(0, 0, e.ctx.canvas.width, e.ctx.canvas.height);
    if (this.anchors.length > 1) {
      // const path = new Path2D();
      // path.moveTo(this.anchors[0].position.x, this.anchors[0].position.y);
      // path.lineTo(this.anchors[1].position.x, this.anchors[1].position.y);
      // e.ctx.strokeStyle = this.app.options.select.color.primaryColor
      //   .toInverted()
      //   .toHex();
      // e.ctx.lineWidth = this.lineWidth;
      // e.ctx.stroke(path);
      this.drawAnchors(e);
    }
  }
}
