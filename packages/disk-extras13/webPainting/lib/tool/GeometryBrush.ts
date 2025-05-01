import { rectangle as drawRectangle } from '../paintUtils';
import Color from '../Color';
import type Brush from '../Brush';
import { getBrushByIndex } from '../Brush';
import BrushTool, { type BrushToolOptions } from './Brush';
import type ExtendedPointerEvent from '../ExtendedPointerEvent';
import { COLOR_VALUE, COLOR } from '../types';

export default class GeometryBrush extends BrushTool {
  COLOR_TRANSPARENT: Color;
  filled: boolean;
  selectedAnchor?: Anchor;
  anchors: Anchor[];
  anchorBrush: Brush;

  startEvent?: ExtendedPointerEvent;

  constructor(options: BrushToolOptions) {
    super(options);

    this.COLOR_TRANSPARENT = new Color(COLOR_VALUE[COLOR.TRANSPARENT]);
    this.filled = false;
    // Anchors
    this.selectedAnchor = undefined;
    this.anchors = [];
    const BrushClass = getBrushByIndex(0);
    this.anchorBrush = new BrushClass({
      app: this.app,
      lowres: true,
      size: 1,
      primaryColor: new Color(COLOR_VALUE[COLOR.BLACK]),
      secondaryColor: new Color(COLOR_VALUE[COLOR.WHITE])
    });
  }

  override onPointerDown(e: ExtendedPointerEvent) {
    this.startEvent = e;
    return {};
  }

  drawAnchors() {
    const data = [...this.anchorBrush.data];
    this.anchors.forEach(anchor => {
      this.drawAnchor(anchor, data);
    });
  }

  drawAnchor(anchor: Anchor, data: number[][]) {
    anchor.intersectMap = [];
    drawRectangle(
      (x, y, filled) => {
        let color = this.app.canvas?.getColorFromPixel(x, y) || new Color();
        if (color.alpha === 0) {
          color = filled
            ? this.anchorBrush.secondaryColor
            : this.anchorBrush.primaryColor;
        } else {
          color.invert();
        }
        const intersectMap = anchor.intersectMap;

        if (intersectMap) {
          intersectMap[Number(x)] = intersectMap[Number(x)] || [];
          intersectMap[Number(x)][Number(y)] = true;
          BrushTool.drawBrush({
            color,
            data,
            x,
            y,
            app: this.app
          });
        }
      },
      anchor.x - 5,
      anchor.y - 5,
      10,
      10,
      {
        strokeSize: 1,
        filled: true
      }
    );
  }

  getAnchorByPosition(x: number, y: number) {
    return this.anchors.find(anchor => {
      if (anchor.intersectAnchor(x, y)) {
        return anchor;
      }
      return false;
    });
  }

  addAnchor(x: number, y: number) {
    const anchor = new Anchor(x, y, this.anchorBrush);
    this.anchors.push(anchor);
    return anchor;
  }

  reset() {
    this.anchors = [];
    this.selectedAnchor = undefined;
  }
}

class Anchor {
  x: number;
  y: number;
  brush: Brush;
  intersectMap?: boolean[][];

  constructor(x: number, y: number, brush: Brush) {
    this.x = x;
    this.y = y;
    this.brush = brush;
  }

  /**
   * @deprecated ???
   */
  intersectAnchor(x: number, y: number) {
    return (
      this.intersectMap &&
      this.intersectMap[Number(x)] &&
      this.intersectMap[Number(x)][Number(y)]
    );
  }
}

export { Anchor };
