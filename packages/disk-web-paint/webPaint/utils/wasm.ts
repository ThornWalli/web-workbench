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
  AirBurshOptions,
  BrushMode as Rust_BrushMode
} from '@web-workbench/wasm/pkg/wasm';
import { BRUSH_MODE, SHAPE_STYLE } from '../types/select';
import type Color from '../lib/classes/Color';

import init from '@web-workbench/wasm';
import Deferred from '@web-workbench/disk-synthesizer/synthesizer/Deferred';
import { STROKE_ALIGN } from '../workers/main/actions/client/useTool/rectangle';

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

// eslint-disable-next-line complexity
export function toBrushMode(mode: BRUSH_MODE) {
  switch (mode) {
    case BRUSH_MODE.NORMAL:
      return Rust_BrushMode.Normal;
    case BRUSH_MODE.REPLACE:
      return Rust_BrushMode.Replace;
    case BRUSH_MODE.MULTIPLY:
      return Rust_BrushMode.Multiply;
    case BRUSH_MODE.SCREEN:
      return Rust_BrushMode.Screen;
    case BRUSH_MODE.OVERLAY:
      return Rust_BrushMode.Overlay;
    case BRUSH_MODE.SOFT_LIGHT:
      return Rust_BrushMode.SoftLight;
    case BRUSH_MODE.HARD_LIGHT:
      return Rust_BrushMode.HardLight;
    case BRUSH_MODE.DIFFERENCE:
      return Rust_BrushMode.Difference;
    case BRUSH_MODE.EXCLUSION:
      return Rust_BrushMode.Exclusion;
    case BRUSH_MODE.COLOR_BURN:
      return Rust_BrushMode.ColorBurn;
    case BRUSH_MODE.LINEAR_BURN:
      return Rust_BrushMode.LinearBurn;
    case BRUSH_MODE.COLOR_DODGE:
      return Rust_BrushMode.ColorDodge;
    case BRUSH_MODE.LINEAR_DODGE:
      return Rust_BrushMode.LinearDodge;
    case BRUSH_MODE.VIVID_LIGHT:
      return Rust_BrushMode.VividLight;
    case BRUSH_MODE.LINEAR_LIGHT:
      return Rust_BrushMode.LinearLight;
    case BRUSH_MODE.PIN_LIGHT:
      return Rust_BrushMode.PinLight;
    case BRUSH_MODE.HARD_MIX:
      return Rust_BrushMode.HardMix;
    case BRUSH_MODE.SUBSTRACT:
      return Rust_BrushMode.Substract;
    case BRUSH_MODE.DIVIDE:
      return Rust_BrushMode.Divide;
    default:
      throw new Error(`Unknown brush mode: ${mode}`);
  }
}

export function toRectangleOptions(options: {
  style: SHAPE_STYLE;
  strokeAlign: STROKE_ALIGN;
  fillColor?: Color;
  segmentLength?: number;
  gapLength?: number;
}) {
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
