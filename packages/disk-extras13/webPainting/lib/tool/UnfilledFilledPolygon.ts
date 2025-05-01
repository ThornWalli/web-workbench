import type ExtendedPointerEvent from '../ExtendedPointerEvent';
import { polygon as drawPolygon } from '../paintUtils';
import type { PointerOptions } from '../types';
import Brush, { type BrushToolOptions } from './Brush';
import GeometryBrush from './GeometryBrush';

export default class UnfilledFilledPolygon extends GeometryBrush {
  status: number;
  constructor(options: BrushToolOptions) {
    super(options);
    this.status = 0;
  }

  override onPointerMove(e: ExtendedPointerEvent, { mouse }: PointerOptions) {
    if (mouse?.pressed && this.selectedAnchor) {
      this.selectedAnchor.x = e.x;
      this.selectedAnchor.y = e.y;
      this.app.canvas?.addPassiveRenderAction(() => {
        this.render(true);
      });
      return {
        render: true
      };
    }
    return {};
  }

  override onPointerDown(e: ExtendedPointerEvent) {
    const selectedAnchor = this.getAnchorByPosition(e.x, e.y);
    switch (this.status) {
      case 1:
        if (selectedAnchor) {
          this.selectedAnchor = selectedAnchor;
        } else {
          this.status = 2;
          this.app.canvas?.addRenderAction(() => {
            this.render(false);
            this.reset();
          });
          return {
            save: true,
            render: true
          };
        }
        break;
      default:
        if (selectedAnchor && this.anchors[0] === selectedAnchor) {
          this.status = 1;
          this.selectedAnchor = selectedAnchor;
        } else {
          this.selectedAnchor = selectedAnchor || this.addAnchor(e.x, e.y);
        }
    }
    this.app.canvas?.addPassiveRenderAction(() => {
      this.render(this.status < 2);
    });
    return {
      render: true
    };
  }

  isClosed() {
    return this.status > 0;
  }

  render(anchor = false) {
    // draw lines
    const setPixel = (x: number, y: number) => {
      const data = [...this.brush.data];
      Brush.drawBrush({
        color: this.brush.primaryColor,
        data,
        x,
        y,
        app: this.app
      });
    };
    drawPolygon(setPixel, this.anchors, this.status > 0, {
      filled: this.filled
    });
    // draw anchors
    if (anchor) {
      this.drawAnchors();
    }
  }

  override reset() {
    super.reset();
    this.status = 0;
  }
}
