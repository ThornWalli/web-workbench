import { ipoint } from '@js-basics/vector';
import Canvas from '../Canvas';

import { rectangle as drawRectangle } from '../paintUtils';

import Color from '../Color';
import { getBrushByIndex } from '../Brush';
import Bounds from '../Bounds';
import GeometryBrush from './GeometryBrush';
import Brush from './Brush';

export default class BrushSelector extends GeometryBrush {
  constructor(options) {
    super(options);
    this.brushPrimaryColor = new Color(Color.COLOR_BLACK);
    this.brushSecondaryColor = new Color(Color.COLOR_WHITE);
    this.brush = new (getBrushByIndex(0))({
      app: this.app,
      size: 1,
      primaryColor: this.brushPrimaryColor,
      secondaryColor: this.brushSecondaryColor
    });
    this.reset();
  }

  intersect(event) {
    if (this.bounds) {
      return (
        event.x > this.bounds.min.x &&
        event.x < this.bounds.max.x &&
        event.y > this.bounds.min.y &&
        event.y < this.bounds.max.y
      );
    }
    return false;
  }

  reset() {
    this.status = 0;
    this.bounds = null;
    this.intersectedStartEvent = null;
    this.croppedImageData = null;
    this.startEvent = null;
  }

  onPointerDown(event) {
    let size;
    switch (this.status) {
      case 3:
        break;
      case 2:
        if (
          this.croppedImageData &&
          (this.intersectedStartEvent || this.intersect(event))
        ) {
          this.intersectedStartEvent = event;
          if (event.rightClick) {
            this.status++;
          } else {
            return {
              events: true,
              render: false
            };
          }
        }
        break;
      case 1:
        size = ipoint(this.bounds.max - this.bounds.min);
        // const width = this.bounds.max.x - this.bounds.min.x;
        // const height = this.bounds.max.y - this.bounds.min.y;
        this.status++;
        if (event.rightClick) {
          // cropped and replace with background color
          const x = this.bounds.min.x;
          const y = this.bounds.min.y;
          this.app.canvas.addRenderAction(() => {
            this.app.canvas.fillPixels(
              this._brush.secondaryColor,
              x,
              y,
              size.x,
              size.y
            );
          });
        }
        this.app.canvas.addPassiveRenderAction(() => {
          this.render(this.startEvent.x, this.startEvent.y, true);
        });
        return {
          events: true,
          render: true
        };
      default:
        return GeometryBrush.prototype.onPointerDown.apply(this, arguments);
    }
  }

  onPointerMove(event, mouse) {
    if (this.intersectedStartEvent && mouse.pressed) {
      const rectInfo = this.getRectInfo(event);

      this._app.canvas.addPassiveRenderAction(() => {
        this.render(rectInfo.x, rectInfo.y, true);
      });
      return {
        render: true
      };
    } else if (this.status === 0) {
      this._app.canvas.addPassiveRenderAction(() => {
        this.render(event.x, event.y, true);
      });
      return {
        render: true
      };
    }
  }

  getRectInfo(event) {
    return {
      width: this.bounds.max.x - this.bounds.min.x,
      height: this.bounds.max.y - this.bounds.min.y,
      x: this.startEvent.x + event.x - this.intersectedStartEvent.x,
      y: this.startEvent.y + event.y - this.intersectedStartEvent.y
    };
  }

  onPointerUp(event) {
    if (this.status === 3) {
      this.app.canvas.addRenderAction(() => {
        const rectInfo = this.getRectInfo(event);
        Canvas.invertImageData(this.croppedImageData);
        this.render(rectInfo.x, rectInfo.y, false);
        this.reset();
      });
      return {
        save: true,
        render: true
      };
    } else if (this.intersectedStartEvent && this.status === 2) {
      const rectInfo = this.getRectInfo(event);
      this.startEvent.x = rectInfo.x;
      this.startEvent.y = rectInfo.y;
      this.bounds = new Bounds(
        ipoint(rectInfo.x, rectInfo.y),
        ipoint(rectInfo.x + rectInfo.width, rectInfo.y + rectInfo.height)
      );
      this._app.canvas.addPassiveRenderAction(() => {
        this.render(rectInfo.x, rectInfo.y, true);
      });
      return {
        render: true
      };
    } else if (this.startEvent && this.status === 0) {
      const width = event.x - this.startEvent.x;
      const height = event.y - this.startEvent.y;
      if (width > 0 && height > 0) {
        this.bounds = new Bounds(
          ipoint(this.startEvent.x, this.startEvent.y),
          ipoint(event.x, event.y)
        );

        this.status++;

        this._app.canvas.addPassiveRenderAction(() => {
          this.croppedImageData = Canvas.cropImageData(
            this.app.canvas.renderImageData,
            this.bounds.min.x,
            this.bounds.min.y,
            width,
            height
          );

          Canvas.invertImageData(this.croppedImageData);
          this.render(this.startEvent.x, this.startEvent.y, true);
        });
      }

      return {
        render: true
      };
    }
  }

  render(x, y, rect) {
    let size = ipoint(0, 0);
    let position = ipoint(x, y);
    if (this.bounds) {
      size = ipoint(() => this.bounds.max - this.bounds.min);
    } else {
      size = ipoint(() => position - this.startEvent.position);
      position = this.startEvent.position;
    }
    if (this.croppedImageData) {
      this.app.canvas.putImageData(
        this.croppedImageData,
        position.x,
        position.y
      );
    }

    if (rect) {
      drawRectangle(
        (x, y) => {
          const data = [].concat(this._brush.data);
          let color = this._app.canvas.getColorFromPixel(x, y);
          if (color.alpha === 0) {
            color = this.brushPrimaryColor;
          } else {
            color.invert();
          }
          Brush.drawBrush({
            color,
            data,
            x,
            y,
            app: this._app
          });
        },
        position.x,
        position.y,
        size.x,
        size.y,
        {
          strokeSize: this._brush.data.length,
          filled: this.filled,
          density: 3
        }
      );
    }
  }
}
