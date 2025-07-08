import type { IPoint } from '@js-basics/vector';
import {
  Dimension,
  LineOptions,
  BezierOptions,
  Point,
  EllipseOptions,
  Color as Rust_Color,
  RectangleOptions,
  PolygonOptions,
  AirBurshOptions
} from '@web-workbench/wasm/pkg/wasm';
import { SHAPE_STYLE, STROKE_ALIGN } from '../types/select';
import type Color from '../lib/classes/Color';

import init from '@web-workbench/wasm';
import Deferred from '@web-workbench/disk-synthesizer/synthesizer/Deferred';

export function toPoint(point: IPoint) {
  return new Point(point.x, point.y);
}

export function toDimension(point: IPoint) {
  return new Dimension(point.x, point.y);
}

export function toColor(color: Color) {
  return new Rust_Color(color.r, color.g, color.b, color.a);
}

export function toLineOptions(options: {
  segmentLength?: number;
  gapLength?: number;
}) {
  return new LineOptions(options.segmentLength || 1, options.gapLength || 0);
}

export function toBezierOptions(options: {
  segmentLength?: number;
  gapLength?: number;
  interpolateSegments?: boolean;
}) {
  return new BezierOptions(
    options.segmentLength || 1,
    options.gapLength || 0,
    options.interpolateSegments ?? false
  );
}

export function toAirBrushOptions(options: {
  round?: boolean;
  strength?: number;
  weight?: number;
}) {
  return new AirBurshOptions(
    options.round ?? true,
    options.strength ?? 100,
    options.weight ?? 1.0
  );
}

export function toShapeStyle(style: SHAPE_STYLE) {
  switch (style) {
    case SHAPE_STYLE.FILLED:
      return 0;
    case SHAPE_STYLE.STROKED:
      return 1;
    case SHAPE_STYLE.STROKED_FILLED:
      return 2;
    default:
      throw new Error(`Unknown shape style: ${style}`);
  }
}

export function toStrokeAlign(align: STROKE_ALIGN) {
  switch (align) {
    case STROKE_ALIGN.INSIDE:
      return 0; // Inside
    case STROKE_ALIGN.CENTER:
      return 1; // Center
    case STROKE_ALIGN.OUTSIDE:
      return 2; // Outside
    default:
      throw new Error(`Unknown stroke align: ${align}`);
  }
}

export function toRectangleOptions(options: {
  style: SHAPE_STYLE;
  strokeAlign: STROKE_ALIGN;
  fillColor?: Color;
  segmentLength?: number;
  gapLength?: number;
}) {
  // style: ShapeStyle, stroke_align: StrokeAlign, fill_color: Color, line_options: LineOptions
  return new RectangleOptions(
    toShapeStyle(options.style),
    toStrokeAlign(options.strokeAlign),
    toLineOptions({
      segmentLength: options.segmentLength,
      gapLength: options.gapLength
    })
  );
}

export function toEllipseOptions(options: {
  style: SHAPE_STYLE;
  fillColor?: Color;
  segmentLength?: number;
  gapLength?: number;
  interpolateSegments?: boolean;
}) {
  return new EllipseOptions(
    toShapeStyle(options.style),
    toLineOptions({
      segmentLength: options.segmentLength,
      gapLength: options.gapLength
    }),
    options.interpolateSegments ?? false
  );
}

export function toPolygonOptions(options: {
  style: SHAPE_STYLE;
  fillColor?: Color;
  segmentLength?: number;
  gapLength?: number;
  interpolateSegments?: boolean;
}) {
  return new PolygonOptions(
    toShapeStyle(options.style),
    toLineOptions({
      segmentLength: options.segmentLength,
      gapLength: options.gapLength
    })
  );
}

let initDeferred: Deferred<void> | undefined = undefined;
export async function setupWasm() {
  if (!initDeferred) {
    initDeferred = new Deferred<void>();
    init().then(() => initDeferred?.resolve());
  }
  return initDeferred.promise;
}
