import type { Observable } from 'rxjs';
import { map } from 'rxjs';

const asyncReplacer: AsyncTransform[] = [
  {
    validator: () => true,
    handler: () => source => source.pipe(map(value => value))
  }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Transform<T = any, R = any> {
  validator: (value: T) => boolean;
  handler: (value: T) => R;
  constructor(validator: (value: T) => boolean, handler: (value: T) => R) {
    this.validator = validator;
    this.handler = handler;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class AsyncTransform<T = any, R = any> {
  validator: (value: T) => boolean;
  handler: () => (source: Observable<T>) => Observable<R>;
  constructor(
    validator: (value: T) => boolean,
    handler: () => (source: Observable<T>) => Observable<R>
  ) {
    this.validator = validator;
    this.handler = handler;
  }
}

export const syncReplacer: Transform[] = [
  new Transform(
    (value: unknown) => isURL(value),
    (value: URL) => value.toString()
  ),
  new Transform(
    (value: unknown) => isDate(value),
    (value: Date) => value.toISOString()
  ),
  new Transform(
    (value: unknown) => isBigInt(value),
    (value: bigint) => `${value.toString()}n`
  ),
  new Transform(
    (value: unknown) => isRegExp(value),
    (value: RegExp) => value.toString()
  ),
  new Transform(
    (value: unknown) => isSymbol(value),
    (value: symbol) => symbolToString(value)
  ),
  new Transform(
    () => true,
    (value: unknown) => value
  )
];

export const createSyncReplacer = (
  transforms: Transform[] = []
): Transform[] => [...transforms, ...syncReplacer];
export const createAsyncReplacer = (
  transforms: AsyncTransform[] = []
): AsyncTransform[] => [...transforms, ...asyncReplacer];

const isURL = (value: unknown): value is URL => value?.constructor === URL;
const isDate = (value: unknown): value is Date => value?.constructor === Date;
const isBigInt = (value: unknown): value is bigint =>
  value?.constructor === BigInt;
const isRegExp = (value: unknown): value is RegExp =>
  value?.constructor === RegExp;
const isSymbol = (value: unknown): value is symbol =>
  value?.constructor === Symbol;

const symbolToString = (value: symbol): string =>
  `${(Symbol.keyFor(value) && 'g') || ''}${value.toString()}`;
