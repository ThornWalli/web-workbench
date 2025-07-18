import { ipoint } from '@js-basics/vector';
import type { IPoint } from '@js-basics/vector';
import type { ToolConstructorOptions, ToolEvent } from '../../Tool';
import type { GeometryLineOptions } from './GeometryLine';
import GeometryLine, { GEOMETRY_LINE_STATE } from './GeometryLine';
import type Anchor from '../../Anchor';
import { TOOL } from '@web-workbench/disk-web-paint/webPaint/types/select';
import type ToolPointerEvent from '../../ToolPointerEvent';

export interface CurveLineOptions extends GeometryLineOptions {
  anchorDimension?: IPoint & number;
  anchorPositions?: (IPoint & number)[];
}

export default class CurveLine extends GeometryLine<CurveLineOptions> {
  lineWidth: number = 2;
  started = false;

  primaryHelperOffset?: IPoint & number;
  secondaryHelperOffset?: IPoint & number;

  constructor(options: ToolConstructorOptions<CurveLineOptions>) {
    super({ ...options, type: TOOL.CURVE_LINE });
  }

  override async pointerUp(e: ToolPointerEvent) {
    await super.pointerUp(e);
    if (this.anchors.length > 1 && this.anchors.length !== 4) {
      this.createHelpers(e);
    }
    this.selectedAnchor = undefined;
  }

  override async pointerDown(e: ToolPointerEvent) {
    await super.pointerDown(e);

    const selectedAnchor = this.getAnchorByPosition(e.position);
    if (selectedAnchor && this.selectedAnchor !== selectedAnchor) {
      this.selectedAnchor = selectedAnchor;
    } else if (this.anchors.length === 4 && !selectedAnchor) {
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
      return;
    } else if (this.anchors.length > 1 && this.anchors.length !== 4) {
      this.createHelpers(e);
    } else if (!this.selectedAnchor) {
      this.addAnchor(e.position);
      this.selectedAnchor = this.addAnchor(e.position);
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
      if (this.anchors.length < 2) {
        this.addAnchor(e.position);
        this.selectedAnchor = this.addAnchor(e.position);
      }
      if (this.selectedAnchor) {
        let position = e.position;
        // if (this.anchors.indexOf(this.selectedAnchor) < 2) {
        position = e.position;
        // }
        this.selectedAnchor.position = position;
        if (this.selectedAnchor === this.primaryAnchor && this.primaryHelper) {
          this.primaryHelper.position = this.primaryHelperOffset!;
        } else if (
          this.selectedAnchor === this.secondaryAnchor &&
          this.secondaryHelper
        ) {
          this.secondaryHelper.position = ipoint(
            () => this.selectedAnchor!.position + this.secondaryHelperOffset!
          );
        } else if (
          this.selectedAnchor === this.primaryHelper ||
          this.selectedAnchor === this.secondaryHelper
        ) {
          this.refreshHelperOffset();
        }
      }
      this.render(e);
      this.action(
        {
          state: GEOMETRY_LINE_STATE.MOVE,
          stackable: false,
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
    this.primaryHelperOffset = undefined;
    this.secondaryHelperOffset = undefined;
  }

  // #region Anchors

  get primaryAnchor() {
    return this.anchors[0];
  }

  get secondaryAnchor() {
    return this.anchors[1];
  }

  get primaryHelper() {
    return this.anchors[2];
  }

  get secondaryHelper() {
    return this.anchors[3];
  }

  // #endregion

  refreshHelperOffset() {
    if (this.primaryHelper) {
      this.primaryHelperOffset = ipoint(
        () => this.primaryHelper.position - this.primaryAnchor.position
      );
    }
    if (this.secondaryHelper) {
      this.secondaryHelperOffset = ipoint(
        () => this.secondaryHelper.position - this.secondaryAnchor.position
      );
    }
  }

  createHelpers(e: ToolPointerEvent) {
    let point = getAnchorHelperPosition(
      this.primaryAnchor,
      this.secondaryAnchor
    );

    this.addAnchor(ipoint(point[0], point[1]));
    point = getAnchorHelperPosition(this.secondaryAnchor, this.primaryAnchor);

    this.addAnchor(ipoint(point[0], point[1]));
    this.refreshHelperOffset();
    this.render(e);
  }

  render(e: ToolPointerEvent) {
    e.ctx.clearRect(0, 0, e.ctx.canvas.width, e.ctx.canvas.height);
    if (this.anchors.length > 1) {
      const path = new Path2D();
      if (this.anchors.length > 2) {
        path.moveTo(
          this.primaryAnchor.position.x,
          this.primaryAnchor.position.y
        );
        path.bezierCurveTo(
          this.primaryHelper.position.x,
          this.primaryHelper.position.y,
          this.secondaryHelper.position.x,
          this.secondaryHelper.position.y,
          this.secondaryAnchor.position.x,
          this.secondaryAnchor.position.y
        );
      } else {
        path.moveTo(
          this.primaryAnchor.position.x,
          this.primaryAnchor.position.y
        );
        path.lineTo(
          this.secondaryAnchor.position.x,
          this.secondaryAnchor.position.y
        );
      }
      e.ctx.strokeStyle = this.app.options.select.color.primaryColor.color
        .toInverted()
        .toHex();
      e.ctx.lineWidth = this.lineWidth;
      e.ctx.stroke(path);
    }

    this.drawAnchors(e, { stroke: false });
  }
}

function getAnchorHelperPosition(anchorA: Anchor, anchorB: Anchor) {
  const points = getLinePoints(
    Math.round(anchorA.position.x),
    Math.round(anchorA.position.y),
    Math.round(anchorB.position.x),
    Math.round(anchorB.position.y)
  );
  return points[Math.floor(points.length / 4)];
}

function getLinePoints(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  density = 0
) {
  const dx = Math.abs(x1 - x0);
  const sx = x0 < x1 ? 1 : -1;
  const dy = Math.abs(y1 - y0);
  const sy = y0 < y1 ? 1 : -1;
  let err = (dx > dy ? dx : -dy) / 2;

  const points = [];
  let i = 0;

  while (true) {
    if (density === 0 || i >= 1) {
      points.push([x0, y0]);
      i = 0;
    } else {
      i += 1 / density;
    }
    if (x0 === x1 && y0 === y1) {
      break;
    }
    const e2 = err;
    if (e2 > -dx) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dy) {
      err += dx;
      y0 += sy;
    }
  }
  return points;
}
