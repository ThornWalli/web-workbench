import type { Observable } from 'rxjs';
import { map } from 'rxjs';

const asyncReplacer: AsyncTransform[] = [
  {
    validator: () => true,
    handler: () => source => source.pipe(map(value => value))
  }
];

/**
 * TODO: Kann man es auch einfacher lösen? ALternativ darf kein unkown oder any verwendet werden.
 */
export type Value =
  | string
  | number
  | boolean
  | null
  | undefined
  | object
  | bigint
  | Date
  | RegExp
  | URL
  | symbol;

/**
 * TODO: Kann man es auch einfacher lösen? ALternativ darf kein unkown oder any verwendet werden.
 */
export type Result =
  | string
  | number
  | boolean
  | null
  | undefined
  | object
  | bigint
  | Date
  | RegExp
  | URL
  | symbol;

export class Transform<T extends Value = Value, R = Result> {
  validator: (value: T) => boolean;
  handler: (value: T) => R;
  constructor(validator: (value: T) => boolean, handler: (value: T) => R) {
    this.validator = validator;
    this.handler = handler;
  }
}

export class AsyncTransform<T = Value, R = Result> {
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
    (value: Value) => isURL(value),
    (value: URL) => value.toString()
  ),
  new Transform(
    (value: Value) => isDate(value),
    (value: Date) => value.toISOString()
  ),
  new Transform(
    (value: Value) => isBigInt(value),
    (value: bigint) => `${value.toString()}n`
  ),
  new Transform(
    (value: Value) => isRegExp(value),
    (value: RegExp) => value.toString()
  ),
  new Transform(
    (value: Value) => isSymbol(value),
    (value: symbol) => symbolToString(value)
  ),
  new Transform(
    () => true,
    (value: Result) => value
  )
];

export const createSyncReplacer = (
  transforms: Transform[] = []
): Transform[] => [...transforms, ...syncReplacer];
export const createAsyncReplacer = (
  transforms: AsyncTransform[] = []
): AsyncTransform[] => [...transforms, ...asyncReplacer];

const isURL = (value: Value): value is URL => value?.constructor === URL;
const isDate = (value: Value): value is Date => value?.constructor === Date;
const isBigInt = (value: Value): value is bigint =>
  value?.constructor === BigInt;
const isRegExp = (value: Value): value is RegExp =>
  value?.constructor === RegExp;
const isSymbol = (value: Value): value is symbol =>
  value?.constructor === Symbol;

const symbolToString = (value: symbol): string =>
  `${(Symbol.keyFor(value) && 'g') || ''}${value.toString()}`;
