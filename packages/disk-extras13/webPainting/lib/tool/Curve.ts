import { clamp } from '@web-workbench/core/utils/math';
import {
  getLinePoints,
  curve as drawCurve,
  line as drawLine
} from '../paintUtils';
import Brush, { type BrushToolOptions } from './Brush';
import type { Anchor } from './GeometryBrush';
import GeometryBrush from './GeometryBrush';
import type ExtendedPointerEvent from '../ExtendedPointerEvent';
import Color from '../Color';
import type { PointerOptions } from '../types';

export default class Curve extends GeometryBrush {
  status: number;
  locked: boolean;
  moved?: boolean;
  points?: boolean[][];

  primaryHelperOffset?: number[];
  secondaryHelperOffset?: number[];

  constructor(options: BrushToolOptions) {
    super(options);
    this.status = 0;
    this.locked = false;
  }

  refreshHelperOffset() {
    if (this.primaryHelper) {
      this.primaryHelperOffset = [
        this.primaryHelper.x - this.primaryAnchor.x,
        this.primaryHelper.y - this.primaryAnchor.y
      ];
    }
    if (this.secondaryHelper) {
      this.secondaryHelperOffset = [
        this.secondaryHelper.x - this.secondaryAnchor.x,
        this.secondaryHelper.y - this.secondaryAnchor.y
      ];
    }
  }

  override onPointerDown(e: ExtendedPointerEvent) {
    if (!this.moved) {
      this.reset();
    }

    if (this.locked) {
      return {};
    }
    this.locked = true;

    if (this.anchors.length === 1) {
      this.reset();
    }

    const selectedAnchor = this.getAnchorByPosition(e.x, e.y);
    if (selectedAnchor && this.selectedAnchor !== selectedAnchor) {
      this.selectedAnchor = selectedAnchor;
    } else if (this.status === 2 && !selectedAnchor) {
      return this.onPointerDownSave();
    } else if (this.status === 1) {
      this.onPointerDownCreateHelpers();
    } else if (!this.selectedAnchor) {
      this.addAnchor(e.x, e.y);
      this.selectedAnchor = this.addAnchor(e.x, e.y);
    }
    this.app.canvas?.addPassiveRenderAction(() => {
      this.render(true);
      this.locked = false;
    });
    return {
      render: true
    };
  }

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

  override onPointerUp() {
    if (this.status < 3 && this.status === 0) {
      this.selectedAnchor = undefined;
      this.status++;
      this.app.canvas?.addPassiveRenderAction(() => {
        this.render(true);
      });
      return {
        render: true
      };
    }
    return {};
  }

  // eslint-disable-next-line complexity
  override onPointerMove(e: ExtendedPointerEvent, { mouse }: PointerOptions) {
    if (
      mouse?.pressed &&
      this.selectedAnchor &&
      this.primaryHelperOffset &&
      this.secondaryHelperOffset
    ) {
      this.moved = true;
      this.selectedAnchor.x = e.x;
      this.selectedAnchor.y = e.y;
      if (this.selectedAnchor === this.primaryAnchor && this.primaryHelper) {
        this.primaryHelper.x =
          this.selectedAnchor.x + this.primaryHelperOffset[0];
        this.primaryHelper.y =
          this.selectedAnchor.y + this.primaryHelperOffset[1];
      } else if (
        this.selectedAnchor === this.secondaryAnchor &&
        this.secondaryHelper
      ) {
        this.secondaryHelper.x =
          this.selectedAnchor.x + this.secondaryHelperOffset[0];
        this.secondaryHelper.y =
          this.selectedAnchor.y + this.secondaryHelperOffset[1];
      } else if (
        this.selectedAnchor === this.primaryHelper ||
        this.selectedAnchor === this.secondaryHelper
      ) {
        this.refreshHelperOffset();
      }
      this.app.canvas?.addPassiveRenderAction(() => {
        this.render(true);
      });
      return {
        render: true
      };
    }
    return {};
  }

  addPoints(newPoints: number[][]) {
    if (!this.app.canvas) {
      throw new Error('Canvas not defined');
    }
    const canvas = this.app.canvas;
    if (Array.isArray(this.points)) {
      const points = this.points;
      newPoints.forEach(point => {
        points[clamp(point[0] - 1, 0, canvas.width - 1)][
          clamp(point[1] - 1, 0, canvas.height - 1)
        ] = true;
      });
    } else {
      throw new Error('Points not defined');
    }
  }

  render(anchor = false) {
    if (this.status > 1) {
      drawCurve(
        (x: number, y: number) => {
          const data = [...this.brush.data];
          Brush.drawBrush({
            color: this.brush.primaryColor,
            data,
            x,
            y,
            app: this.app
          });
        },
        this.primaryAnchor.x,
        this.primaryAnchor.y,
        this.primaryHelper.x,
        this.primaryHelper.y,
        this.secondaryHelper.x,
        this.secondaryHelper.y,
        this.secondaryAnchor.x,
        this.secondaryAnchor.y
      );
    } else {
      drawLine(
        (x: number, y: number) => {
          const data = [...this.brush.data];
          GeometryBrush.drawBrush({
            color: this.brush.primaryColor,
            data,
            x,
            y,
            app: this.app
          });
        },
        this.primaryAnchor.x,
        this.primaryAnchor.y,
        this.secondaryAnchor.x,
        this.secondaryAnchor.y,
        {}
      );
    }
    if (anchor) {
      if (this.primaryHelper) {
        drawLine(
          (x: number, y: number) => {
            let color = this.app.canvas?.getColorFromPixel(x, y) || new Color();
            if (color.alpha === 0) {
              color = this.anchorBrush.primaryColor;
            } else {
              color.invert();
            }
            const data = [...this.anchorBrush.data];
            GeometryBrush.drawBrush({
              color,
              data,
              x,
              y,
              app: this.app
            });
          },
          this.primaryAnchor.x,
          this.primaryAnchor.y,
          this.primaryHelper.x,
          this.primaryHelper.y,
          {}
        );
      }
      if (this.secondaryHelper) {
        drawLine(
          (x: number, y: number) => {
            let color = this.app.canvas?.getColorFromPixel(x, y) || new Color();
            if (color.alpha === 0) {
              color = this.anchorBrush.primaryColor;
            } else {
              color.invert();
            }
            // color: new Color([0, 255, 0, 255]),
            const data = [...this.anchorBrush.data];
            GeometryBrush.drawBrush({
              color,
              data,
              x,
              y,
              app: this.app
            });
          },
          this.secondaryAnchor.x,
          this.secondaryAnchor.y,
          this.secondaryHelper.x,
          this.secondaryHelper.y,
          {}
        );
      }

      // draw anchors
      this.drawAnchors();
    }
  }

  override reset() {
    super.reset();
    this.status = 0;
    this.locked = false;
  }

  intersect(x: number, y: number) {
    const positions = [
      [0, 0],
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1]
    ];
    if (this.points) {
      const points = this.points;
      for (let i = 0; i < positions.length; i++) {
        if (points[x + positions[Number(i)][0]][y + positions[Number(i)][1]]) {
          return true;
        }
      }
    }
    return false;
  }

  onPointerDownCreateHelpers() {
    let point = getAnchorHelperPosition(
      this.primaryAnchor,
      this.secondaryAnchor
    );
    this.addAnchor(point[0], point[1]);
    point = getAnchorHelperPosition(this.secondaryAnchor, this.primaryAnchor);
    this.addAnchor(point[0], point[1]);
    this.refreshHelperOffset();
    this.app.canvas?.addPassiveRenderAction(() => {
      this.render(true);
      this.locked = false;
    });
    this.status++;
  }
  onPointerDownSave() {
    this.app.canvas?.addRenderAction(() => {
      this.render(false);
      this.reset();
    });
    return {
      events: false,
      save: true,
      render: true
    };
  }
}

function getAnchorHelperPosition(anchorA: Anchor, anchorB: Anchor) {
  const points = getLinePoints(anchorA.x, anchorA.y, anchorB.x, anchorB.y);
  return points[Math.floor(points.length / 4)];
}
