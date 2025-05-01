import { ipoint, calc } from '@js-basics/vector';
import { rectangle as drawRectangle } from '../paintUtils';

import Color from '../Color';
import { getBrushByIndex } from '../Brush';
import Bounds from '../Bounds';
import GeometryBrush from './GeometryBrush';
import Brush, { type BrushToolOptions } from './Brush';
import type ExtendedPointerEvent from '../ExtendedPointerEvent';
import { COLOR_VALUE, COLOR } from '../types';

export default class Magnifier extends GeometryBrush {
  brushPrimaryColor: Color;
  brushSecondaryColor: Color;
  moving: boolean;
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

    this.moving = false;
  }

  override onPointerMove(e: ExtendedPointerEvent) {
    if (this.startEvent) {
      const startX = this.startEvent.x;
      const startY = this.startEvent.y;
      const x = e.x - startX;
      const y = e.y - startY;
      if (!this.moving) {
        this.moving = true;
        this.app.canvas?.addPassiveRenderAction(() => {
          drawRectangle(
            (x, y) => {
              const data = [...this.brush.data];
              let color =
                this.app.canvas?.getColorFromPixel(x, y) || new Color();
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
            startX,
            startY,
            x,
            y,
            {
              strokeSize: this.brush.data.length,
              filled: false
            }
          );
          this.moving = false;
        });
      }
    }
    return {
      render: true
    };
  }

  override onPointerUp(e: ExtendedPointerEvent) {
    if (this.startEvent) {
      this.app.canvas?.cleanPassiveRenderActions();

      const position = ipoint(e.x, e.y);
      const startPosition = ipoint(this.startEvent.x, this.startEvent.y);
      const size = calc(() => Math.floor(position - startPosition));

      if (size.x > 0 && size.y > 0) {
        const bounds = new Bounds(startPosition, position);
        const display = this.app.display;
        if (display) {
          const factor = calc(() =>
            Math.floor(
              (display.canvasLayout.naturalSize / size) * display.zoomFactor
            )
          );
          const center = calc(() => bounds.min + size / 2);
          display.setZoom(factor.x > factor.y ? factor.x : factor.y, center);
        }
      }
    }
    return {
      render: true
    };
  }
}
