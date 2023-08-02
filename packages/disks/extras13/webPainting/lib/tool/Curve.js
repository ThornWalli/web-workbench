
import { clamp } from '@web-workbench/core/utils/math';
import { getLinePoints, curve as drawCurve, line as drawLine } from '../paintUtils';
import Brush from './Brush';
import GeometryBrush from './GeometryBrush';

export default class Curve extends GeometryBrush {
  constructor (options) {
    super(options);
    this.status = 0;
    this.locked = false;
  }

  refreshHelperOffset () {
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

  // eslint-disable-next-line complexity
  onPointerDown (event) {
    if (!this.moved) {
      this.reset();
    }

    if (this.locked) {
      return;
    }
    this.locked = true;

    if (this.anchors.length === 1) {
      this.reset();
    }

    const selectedAnchor = this.getAnchorByPosition(event.x, event.y);
    if (selectedAnchor && this.selectedAnchor !== selectedAnchor) {
      this.selectedAnchor = selectedAnchor;
    } else if (this.status === 2 && !selectedAnchor) {
      return onPointerDownSave.bind(this)();
    } else if (this.status === 1) {
      onPointerDownCreateHelpers.bind(this)();
    } else if (!this.selectedAnchor) {
      this.addAnchor(event.x, event.y);
      this.selectedAnchor = this.addAnchor(event.x, event.y);
    }
    this._app.canvas.addPassiveRenderAction(() => {
      this.render(true);
      this.locked = false;
    });
    return {
      render: true
    };
  }

  get primaryAnchor () {
    return this.anchors[0];
  }

  get secondaryAnchor () {
    return this.anchors[1];
  }

  get primaryHelper () {
    return this.anchors[2];
  }

  get secondaryHelper () {
    return this.anchors[3];
  }

  onPointerUp () {
    if (this.status < 3 && this.status === 0) {
      this.selectedAnchor = null;
      this.status++;
      this._app.canvas.addPassiveRenderAction(() => {
        this.render(true);
      });
      return {
        render: true
      };
    }
  }

  // eslint-disable-next-line complexity
  onPointerMove (event, mouse) {
    if (mouse.pressed && this.selectedAnchor) {
      this.moved = true;
      this.selectedAnchor.x = event.x;
      this.selectedAnchor.y = event.y;
      if (this.selectedAnchor === this.primaryAnchor && this.primaryHelper) {
        this.primaryHelper.x = this.selectedAnchor.x + this.primaryHelperOffset[0];
        this.primaryHelper.y = this.selectedAnchor.y + this.primaryHelperOffset[1];
      } else if (this.selectedAnchor === this.secondaryAnchor && this.secondaryHelper) {
        this.secondaryHelper.x = this.selectedAnchor.x + this.secondaryHelperOffset[0];
        this.secondaryHelper.y = this.selectedAnchor.y + this.secondaryHelperOffset[1];
      } else if (
        this.selectedAnchor === this.primaryHelper ||
                this.selectedAnchor === this.secondaryHelper
      ) {
        this.refreshHelperOffset();
      }
      this._app.canvas.addPassiveRenderAction(() => {
        this.render(true);
      });
      return {
        render: true
      };
    }
  }

  addPoints (newPoints) {
    newPoints.forEach((point) => {
      this.points[clamp(point[0] - 1, 0, this._app.canvas.width - 1)][
        clamp(point[1] - 1, 0, this._app.canvas.height - 1)
      ] = true;
    });
  }

  render (anchor = false) {
    if (this.status > 1) {
      drawCurve(
        (x, y) => {
          const data = [].concat(this._brush.data);
          Brush.drawBrush({
            color: this._brush.primaryColor,
            data,
            x,
            y,
            app: this._app
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
        (x, y) => {
          const data = [].concat(this._brush.data);
          GeometryBrush.drawBrush({
            color: this._brush.primaryColor,
            data,
            x,
            y,
            app: this._app
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
          (x, y) => {
            let color = this._app.canvas.getColorFromPixel(x, y);
            if (color.alpha === 0) {
              color = this.anchorBrush.primaryColor;
            } else {
              color.invert();
            }
            const data = [].concat(this.anchorBrush.data);
            GeometryBrush.drawBrush({
              color,
              data,
              x,
              y,
              app: this._app
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
          (x, y) => {
            let color = this._app.canvas.getColorFromPixel(x, y);
            if (color.alpha === 0) {
              color = this.anchorBrush.primaryColor;
            } else {
              color.invert();
            }
            // color: new Color([0, 255, 0, 255]),
            const data = [].concat(this.anchorBrush.data);
            GeometryBrush.drawBrush({
              color,
              data,
              x,
              y,
              app: this._app
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

  reset () {
    GeometryBrush.prototype.reset.apply(this, arguments);
    this.status = 0;
    this.locked = false;
  }

  intersect (x, y) {
    const positions = [
      [
        0, 0
      ],
      [
        -1, -1
      ],
      [
        0, -1
      ],
      [
        1, -1
      ],
      [
        -1, 0
      ],
      [
        1, 0
      ],
      [
        -1, 1
      ],
      [
        0, 1
      ],
      [
        1, 1
      ]
    ];
    for (let i = 0; i < positions.length; i++) {
      if (this.points[x + positions[Number(i)][0]][y + positions[Number(i)][1]]) {
        return true;
      }
    }
    return false;
  }
}

function onPointerDownCreateHelpers () {
  let point = getAnchorHelperPosition(this.primaryAnchor, this.secondaryAnchor);
  this.addAnchor(point[0], point[1]);
  point = getAnchorHelperPosition(this.secondaryAnchor, this.primaryAnchor);
  this.addAnchor(point[0], point[1]);
  this.refreshHelperOffset();
  this._app.canvas.addPassiveRenderAction(() => {
    this.render(true);
    this.locked = false;
  });
  this.status++;
}

function onPointerDownSave () {
  this._app.canvas.addRenderAction(() => {
    this.render(false);
    this.reset();
  });
  return {
    events: false,
    save: true,
    render: true
  };
}

function getAnchorHelperPosition (anchorA, anchorB) {
  const points = getLinePoints(anchorA.x, anchorA.y, anchorB.x, anchorB.y);
  return points[Math.floor(points.length / 4)];
}
