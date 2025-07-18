import type { IPoint } from '@js-basics/vector';
import init, {
  Dimension,
  LineOptions,
  BezierOptions,
  Point,
  EllipseOptions,
  Color as Rust_Color,
  RectangleOptions,
  PolygonOptions,
  AirBurshOptions,
  BrushMode as Rust_BrushMode,
  RotateType,
  FlipType
} from '@web-workbench/wasm';
import { BRUSH_MODE, SHAPE_STYLE } from '../types/select';
import type Color from '../lib/classes/Color';

import Deferred from '@web-workbench/disk-synthesizer/synthesizer/Deferred';
import { STROKE_ALIGN } from '../workers/main/actions/client/useTool/rectangle';
import { FLIP_TYPE, ROTATE_TYPE } from '../types/worker/main';

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
  seed?: number;
}) {
  return new LineOptions(
    options.segmentLength || 1,
    options.gapLength || 0,
    BigInt(options.seed ?? 0)
  );
}

export function toBezierOptions(options: {
  segmentLength?: number;
  gapLength?: number;
  interpolateSegments?: boolean;
  seed?: number;
}) {
  return new BezierOptions(
    options.segmentLength || 1,
    options.gapLength || 0,
    options.interpolateSegments ?? false,
    BigInt(options.seed ?? 0)
  );
}

export function toAirBrushOptions(options: {
  round?: boolean;
  strength?: number;
  weight?: number;
  seed?: number;
}) {
  return new AirBurshOptions(
    options.round ?? true,
    options.strength ?? 100,
    options.weight ?? 1.0,
    BigInt(options.seed ?? 0)
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

export function toRotateType(type: ROTATE_TYPE) {
  switch (type) {
    case ROTATE_TYPE.ROTATE_90_DEGRESS:
      return RotateType.Rotate90Degrees;
    case ROTATE_TYPE.ROTATE_180_DEGRESS:
      return RotateType.Rotate180Degrees;
    case ROTATE_TYPE.ROTATE_270_DEGRESS:
      return RotateType.Rotate270Degrees;
    default:
      throw new Error(`Unknown rotate type: ${type}`);
  }
}

export function toFlipType(type: FLIP_TYPE) {
  switch (type) {
    case FLIP_TYPE.HORIZONTAL:
      return FlipType.Horizontal;
    case FLIP_TYPE.VERTICAL:
      return FlipType.Vertical;
    default:
      throw new Error(`Unknown flip type: ${type}`);
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
  seed?: number;
}) {
  return new RectangleOptions(
    toShapeStyle(options.style),
    toStrokeAlign(options.strokeAlign),
    toLineOptions({
      segmentLength: options.segmentLength,
      gapLength: options.gapLength,
      seed: options.seed
    }),
    BigInt(options.seed ?? 0)
  );
}

export function toEllipseOptions(options: {
  style: SHAPE_STYLE;
  fillColor?: Color;
  segmentLength?: number;
  gapLength?: number;
  interpolateSegments?: boolean;
  seed?: number;
}) {
  return new EllipseOptions(
    toShapeStyle(options.style),
    toLineOptions({
      segmentLength: options.segmentLength,
      gapLength: options.gapLength
    }),
    options.interpolateSegments ?? false,
    BigInt(options.seed ?? 0)
  );
}

export function toPolygonOptions(options: {
  style: SHAPE_STYLE;
  fillColor?: Color;
  segmentLength?: number;
  gapLength?: number;
  interpolateSegments?: boolean;
  seed?: number;
}) {
  return new PolygonOptions(
    toShapeStyle(options.style),
    toLineOptions({
      segmentLength: options.segmentLength,
      gapLength: options.gapLength,
      seed: options.seed
    }),
    BigInt(options.seed ?? 0)
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
