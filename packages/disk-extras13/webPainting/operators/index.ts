import { ipoint, IPoint } from '@js-basics/vector';
import { AsyncTransform } from './serializer/replacer';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { deserialize, serialize } from './serializer';
import { DisplayOptions } from '../lib/classes/Display';
import { Color } from '../lib/classes/Color';

export const replacerAsyncTransforms = [
  new AsyncTransform<IPoint, ReturnType<IPoint['toJSON']>>(
    value => value && value instanceof IPoint,
    () => source => source.pipe(map(value => value.toJSON()))
  ),
  new AsyncTransform<DisplayOptions, ReturnType<DisplayOptions['toJSON']>>(
    value => value && value instanceof DisplayOptions,
    () => source => source.pipe(map(value => value.toJSON()))
  ),
  new AsyncTransform<Color, ReturnType<Color['toJSON']>>(
    value => value && value instanceof Color,
    () => source => source.pipe(map(value => value.toJSON()))
  )
];
export const reviverAsyncTransforms = [
  new AsyncTransform<{ x: number; y: number }, IPoint>(
    value => typeof value === 'object' && 'x' in value && 'y' in value,
    () => source => source.pipe(map(value => ipoint(value.x, value.y)))
  ),
  new AsyncTransform<ReturnType<DisplayOptions['toJSON']>, DisplayOptions>(
    value => value && DisplayOptions.prototype.constructor.name === value._type,
    () => source => source.pipe(map(value => new DisplayOptions(value)))
  ),
  new AsyncTransform<ReturnType<Color['toJSON']>, Color>(
    value => value && Color.prototype.constructor.name === value._type,
    () => source => source.pipe(map(value => new Color(value)))
  )
];

export function serializeWorkerPostMessage<T>() {
  return (source: Observable<T>) =>
    source.pipe(serialize(replacerAsyncTransforms));
}

export function deserializeWorkerPostMessage<T>() {
  return (source: Observable<T>) =>
    source.pipe(deserialize(reviverAsyncTransforms));
}
