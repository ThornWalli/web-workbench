import { ipoint, IPoint } from '@js-basics/vector';
import { AsyncTransform, type Result, type Value } from './serializer/replacer';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { deserialize, serialize } from './serializer';
import DisplayOptions from '../lib/classes/DisplayOptions';
import Color from '@web-workbench/core/classes/Color';
import PaletteColor from '../lib/classes/PaletteColor';
import Palette from '../lib/classes/Palette';

export const replacerAsyncTransforms = [
  new AsyncTransform<IPoint, ReturnType<IPoint['toJSON']>>(
    value => value && value instanceof IPoint,
    () => source =>
      source.pipe(map(value => ({ __type: 'IPoint', ...value.toJSON() })))
  ),
  new AsyncTransform<DisplayOptions, ReturnType<DisplayOptions['toJSON']>>(
    value => value && value instanceof DisplayOptions,
    () => source => source.pipe(map(value => value.toJSON()))
  ),
  new AsyncTransform<Color, ReturnType<Color['toJSON']>>(
    value => value && value instanceof Color,
    () => source => source.pipe(map(value => value.toJSON()))
  ),
  new AsyncTransform<PaletteColor, ReturnType<PaletteColor['toJSON']>>(
    value => value && value instanceof PaletteColor,
    () => source => source.pipe(map(value => value.toJSON()))
  ),
  new AsyncTransform<Palette, ReturnType<Palette['toJSON']>>(
    value => value && value instanceof Palette,
    () => source => source.pipe(map(value => value.toJSON()))
  )
];
export const reviverAsyncTransforms = [
  new AsyncTransform<{ x: number; y: number }, IPoint>(
    value =>
      typeof value === 'object' &&
      '__type' in value &&
      value.__type === 'IPoint',
    () => source => source.pipe(map(value => ipoint(value.x, value.y)))
  ),
  new AsyncTransform<ReturnType<DisplayOptions['toJSON']>, DisplayOptions>(
    value => value && DisplayOptions.TYPE === value._type,
    () => source => source.pipe(map(value => new DisplayOptions(value)))
  ),
  new AsyncTransform<ReturnType<Color['toJSON']>, Color>(
    value => value && Color.TYPE === value._type,
    () => source => source.pipe(map(value => new Color(value)))
  ),
  new AsyncTransform<ReturnType<PaletteColor['toJSON']>, PaletteColor>(
    value => value && PaletteColor.TYPE === value._type,
    () => source => source.pipe(map(value => new PaletteColor(value)))
  ),
  new AsyncTransform<ReturnType<Palette['toJSON']>, Palette>(
    value => value && Palette.TYPE === value._type,
    () => source => source.pipe(map(value => new Palette(value)))
  )
];

export function serializeWorkerPostMessage<T extends Value>() {
  return (source: Observable<T>) =>
    source.pipe(serialize(replacerAsyncTransforms));
}

export function deserializeWorkerPostMessage<T extends Result>() {
  return (source: Observable<T>) =>
    source.pipe(deserialize(reviverAsyncTransforms));
}

export function serializeWithTransforms<T extends Value>() {
  return (source: Observable<T>) =>
    source.pipe(serialize(replacerAsyncTransforms));
}
export function deserializeWithTransforms<T extends Result>() {
  return (source: Observable<T>) =>
    source.pipe(deserialize(reviverAsyncTransforms));
}
