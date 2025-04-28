import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import Canvas from '../Canvas';

import { rectangle as drawRectangle } from '../paintUtils';

import { getBrushByIndex } from '../Brush';
import Bounds from '../Bounds';
import GeometryBrush from './GeometryBrush';
import Brush, { type BrushToolOptions } from './Brush';
import type ExtendedPointerEvent from '../ExtendedPointerEvent';
import Color from '../Color';
import { COLOR_VALUE, COLOR, type PointerOptions } from '../types';

export default class BrushSelector extends GeometryBrush {
  brushPrimaryColor: Color;
  brushSecondaryColor: Color;
  bounds?: Bounds;
  status?: number;
  croppedImageData?: ImageData;
  intersectedStartEvent?: ExtendedPointerEvent;

  constructor(options: BrushToolOptions) {
    super(options);
    this.brushPrimaryColor = new Color(COLOR_VALUE[COLOR.BLACK]);
    this.brushSecondaryColor = new Color(COLOR_VALUE[COLOR.WHITE]);
    this.brush = new (getBrushByIndex(0))({
      app: this.app,
      size: 1,
      lowres: true,
      primaryColor: this.brushPrimaryColor,
      secondaryColor: this.brushSecondaryColor
    });
    this.reset();
  }

  intersect(e: ExtendedPointerEvent) {
    if (this.bounds) {
      return (
        e.x > this.bounds.min.x &&
        e.x < this.bounds.max.x &&
        e.y > this.bounds.min.y &&
        e.y < this.bounds.max.y
      );
    }
    return false;
  }

  override reset() {
    this.status = 0;
    this.bounds = undefined;
    this.intersectedStartEvent = undefined;
    this.croppedImageData = undefined;
    this.startEvent = undefined;
  }

  override onPointerDown(e: ExtendedPointerEvent) {
    let size: IPoint & number;
    switch (this.status) {
      case 3:
        break;
      case 2:
        if (
          this.croppedImageData &&
          (this.intersectedStartEvent || this.intersect(e))
        ) {
          this.intersectedStartEvent = e;
          if (e.rightClick) {
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
        if (!this.bounds) {
          throw new Error('Bounds not defined');
        }

        size = ipoint(this.bounds.max - this.bounds.min);
        // const width = this.bounds.max.x - this.bounds.min.x;
        // const height = this.bounds.max.y - this.bounds.min.y;
        this.status++;
        if (e.rightClick) {
          // cropped and replace with background color
          const x = this.bounds.min.x;
          const y = this.bounds.min.y;
          this.app.canvas?.addRenderAction(() => {
            this.app.canvas?.fillPixels(
              this.brush.secondaryColor,
              x,
              y,
              size.x,
              size.y
            );
          });
        }
        this.app.canvas?.addPassiveRenderAction(() => {
          if (this.startEvent) {
            this.render(this.startEvent.x, this.startEvent.y, true);
          }
        });
        return {
          events: true,
          render: true
        };
      default:
        return super.onPointerDown(e);
    }
    return {};
  }

  override onPointerMove(e: ExtendedPointerEvent, { mouse }: PointerOptions) {
    if (this.intersectedStartEvent && mouse?.pressed) {
      const rectInfo = this.getRectInfo(e);

      this.app.canvas?.addPassiveRenderAction(() => {
        this.render(rectInfo.x, rectInfo.y, true);
      });
      return {
        render: true
      };
    } else if (this.status === 0) {
      this.app.canvas?.addPassiveRenderAction(() => {
        this.render(e.x, e.y, true);
      });
      return {
        render: true
      };
    }
    return {};
  }

  getRectInfo(e: ExtendedPointerEvent) {
    if (!this.bounds || !this.startEvent || !this.intersectedStartEvent) {
      throw new Error(
        'Bounds, startEvent or intersectedStartEvent not defined'
      );
    }
    return {
      width: this.bounds.max.x - this.bounds.min.x,
      height: this.bounds.max.y - this.bounds.min.y,
      x: this.startEvent.x + e.x - this.intersectedStartEvent.x,
      y: this.startEvent.y + e.y - this.intersectedStartEvent.y
    };
  }

  override onPointerUp(e: ExtendedPointerEvent) {
    if (this.status === 3) {
      this.app.canvas?.addRenderAction(() => {
        const rectInfo = this.getRectInfo(e);

        if (!this.croppedImageData) {
          throw new Error('Cropped image data not defined');
        }

        Canvas.invertImageData(this.croppedImageData);
        this.render(rectInfo.x, rectInfo.y, false);
        this.reset();
      });
      return {
        save: true,
        render: true
      };
    } else if (this.intersectedStartEvent && this.status === 2) {
      const rectInfo = this.getRectInfo(e);
      if (this.startEvent) {
        this.startEvent.x = rectInfo.x;
        this.startEvent.y = rectInfo.y;
      } else {
        throw new Error('Start event not defined');
      }
      this.bounds = new Bounds(
        ipoint(rectInfo.x, rectInfo.y),
        ipoint(rectInfo.x + rectInfo.width, rectInfo.y + rectInfo.height)
      );
      this.app.canvas?.addPassiveRenderAction(() => {
        this.render(rectInfo.x, rectInfo.y, true);
      });
      return {
        render: true
      };
    } else if (this.startEvent && this.status === 0) {
      const width = e.x - this.startEvent.x;
      const height = e.y - this.startEvent.y;
      if (width > 0 && height > 0) {
        this.bounds = new Bounds(
          ipoint(this.startEvent.x, this.startEvent.y),
          ipoint(e.x, e.y)
        );

        this.status++;

        this.app.canvas?.addPassiveRenderAction(() => {
          if (
            this.bounds &&
            this.startEvent &&
            this.app.canvas?.renderImageData
          ) {
            this.croppedImageData = Canvas.cropImageData(
              this.app.canvas?.renderImageData,
              this.bounds.min.x,
              this.bounds.min.y,
              width,
              height
            );

            Canvas.invertImageData(this.croppedImageData);
            this.render(this.startEvent.x, this.startEvent.y, true);
          }
        });
      }

      return {
        render: true
      };
    }
    return {};
  }

  render(x: number, y: number, rect: boolean) {
    let size = ipoint(0, 0);
    let position = ipoint(x, y);
    if (this.bounds) {
      const bounds = this.bounds;
      size = ipoint(() => bounds.max - bounds.min);
    } else if (this.startEvent) {
      position = this.startEvent.position;
      size = ipoint(() => position - position);
    }
    if (this.croppedImageData) {
      this.app.canvas?.putImageData(
        this.croppedImageData,
        position.x,
        position.y
      );
    }

    if (rect) {
      drawRectangle(
        (x, y) => {
          const data = [...this.brush.data];
          let color = this.app.canvas?.getColorFromPixel(x, y) || new Color();
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
            app: this.app
          });
        },
        position.x,
        position.y,
        size.x,
        size.y,
        {
          strokeSize: this.brush.data.length,
          filled: this.filled,
          density: 3
        }
      );
    }
  }
}
