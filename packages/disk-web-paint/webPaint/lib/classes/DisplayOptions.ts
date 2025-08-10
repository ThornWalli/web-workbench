import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import Color from '@web-workbench/core/classes/Color';
import { DISPLAY_ORIGIN } from '../../types/display';
import type { Colors, Grid, PixelGrid } from '../../types/display';

/* eslint-disable complexity */
export default class DisplayOptions {
  static TYPE = 'DisplayOptions';

  origin: DISPLAY_ORIGIN;
  /**
   * Normalized position in the display. 0.1 is 10% of the display width/height.
   */
  position: IPoint & number;
  colors: Colors;

  pixelGrid: PixelGrid;
  grid: Grid;

  zoomLevel: number;

  precision: number;

  constructor(
    options?: Partial<DisplayOptions | ReturnType<DisplayOptions['toJSON']>>
  ) {
    const { origin, position, colors, pixelGrid, grid, zoomLevel } =
      options || {};
    this.origin = origin || DISPLAY_ORIGIN.CENTER;
    this.position = position ? ipoint(position.x, position.y) : ipoint(0, 0);
    this.colors = {
      background: colors?.background
        ? new Color(colors.background)
        : new Color(0, 0, 0),
      foreground: colors?.foreground
        ? new Color(colors.foreground)
        : new Color(255, 255, 255)
    };
    this.pixelGrid = {
      color: pixelGrid?.color
        ? new Color(pixelGrid.color)
        : new Color(0, 0, 0, 255 * 0.2),
      lineWidth: pixelGrid?.lineWidth ?? 1,
      visibleCount: pixelGrid?.visibleCount ?? 10
    };
    this.grid = {
      active: grid?.active ?? false,
      colors: {
        primary: grid?.colors
          ? new Color(grid.colors.primary)
          : new Color(0, 221, 204, 255 * 0.6),
        secondary: grid?.colors
          ? new Color(grid.colors.secondary)
          : new Color(0, 221, 204, 255 * 0.4)
      },
      position: grid?.position
        ? ipoint(grid.position.x, grid.position.y)
        : ipoint(0, 0),
      dimension: grid?.dimension
        ? ipoint(grid.dimension.x, grid.dimension.y)
        : ipoint(1, 1)
    };
    this.zoomLevel = zoomLevel || 1;
    this.precision = 3;
  }

  toJSON() {
    return {
      _type: DisplayOptions.TYPE,
      origin: this.origin,
      position: this.position.toJSON(),
      colors: {
        background: this.colors.background.toJSON(),
        foreground: this.colors.foreground.toJSON()
      },
      pixelGrid: {
        color: this.pixelGrid.color.toJSON(),
        lineWidth: this.pixelGrid.lineWidth,
        visibleCount: this.pixelGrid.visibleCount
      },
      grid: {
        active: this.grid.active,
        colors: {
          primary: this.grid.colors.primary.toJSON(),
          secondary: this.grid.colors.secondary.toJSON()
        },
        position: this.grid.position.toJSON(),
        dimension: this.grid.dimension.toJSON()
      },
      zoomLevel: this.zoomLevel,
      precision: this.precision
    };
  }
}

export const DISPLAY_ORIGIN_VALUE = {
  [DISPLAY_ORIGIN.TOP_LEFT]: ipoint(-1, -1),
  [DISPLAY_ORIGIN.TOP_CENTER]: ipoint(0, -1),
  [DISPLAY_ORIGIN.TOP_RIGHT]: ipoint(1, -1),
  [DISPLAY_ORIGIN.CENTER_LEFT]: ipoint(-1, 0),
  [DISPLAY_ORIGIN.CENTER]: ipoint(0, 0),
  [DISPLAY_ORIGIN.CENTER_RIGHT]: ipoint(1, 0),
  [DISPLAY_ORIGIN.BOTTOM_LEFT]: ipoint(-1, 1),
  [DISPLAY_ORIGIN.BOTTOM_CENTER]: ipoint(0, 1),
  [DISPLAY_ORIGIN.BOTTOM_RIGHT]: ipoint(1, 1)
};
