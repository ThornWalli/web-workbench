import type { OperatorFunction } from 'rxjs';
import {
  Observable,
  concatAll,
  concatMap,
  from,
  map,
  mergeMap,
  of,
  toArray
} from 'rxjs';

import type {
  Transform,
  AsyncTransform,
  Value,
  Result
} from './serializer/replacer';
import { createAsyncReplacer } from './serializer/replacer';
import { createAsyncReviver } from './serializer/reviver';

type TransformInstructionHandler<T extends Value> = (
  transforms: Transform[],
  source?: Observable<T>
) => Result;

interface TraverseInstructions {
  [key: string | symbol | number]: TransformInstructionHandler<
    OperatorFunction<string | symbol | number, Result>
  >;
}

const traverseInstructions: TraverseInstructions = {
  [Object.prototype.constructor.name]:
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    (transforms: Transform[]) => (source: Observable<{}>) =>
      source.pipe(
        map(Object.entries),

        traverse<[string, Value][], [string, Value][]>(transforms),
        map(Object.fromEntries)
      ),
  [Array.prototype.constructor.name]:
    (transforms: Transform[]) => (source: Observable<Transform[]>) =>
      source.pipe(concatAll(), traverse(transforms), toArray()),
  [Promise.prototype.constructor.name]:
    (transforms: Transform[]) => (source: Observable<Promise<Result>>) =>
      source.pipe(
        concatMap(value => from(value)),
        traverse(transforms)
      ),
  [Observable.prototype.constructor.name]:
    (transforms: Transform[]) => (source: Observable<Observable<Result>>) =>
      source.pipe(
        concatMap(value => value as Observable<Result>),
        traverse(transforms)
      ),

  ['']: () => (source: Value) => source
};

export function serialize<T extends Value>(
  asyncTransforms: AsyncTransform[] = []
) {
  return (source: Observable<T>) =>
    source.pipe(traverse<T, T>(createAsyncReplacer(asyncTransforms)));
}

// If generics are not the same, a different type may be required in each case.
export function deserialize<T extends Value>(
  asyncTransforms: AsyncTransform[] = []
) {
  return (source: Observable<T>) =>
    source.pipe(traverse<T, T>(createAsyncReviver(asyncTransforms)));
}

export function traverse<T extends Value, R extends Result>(
  transforms: Transform[]
): OperatorFunction<T, R> {
  return (source: Observable<T>) =>
    source.pipe(
      mergeMap(data => {
        const key = getInstructionKey(data);
        const handler = key && traverseInstructions[key];
        if (!handler) {
          return of(data);
        }
        return of(data).pipe(handler(transforms) as OperatorFunction<T, R>);
      }),
      transform(transforms)
    );
}

function getInstructionKey(data: Value) {
  if (data === null || data === undefined) {
    return undefined;
  }
  const constructor = data.constructor;
  if (constructor) {
    const key = constructor.name;
    if (Object.prototype.hasOwnProperty.call(traverseInstructions, key)) {
      return key;
    }
  }
  return undefined;
}

function transform<T extends Value, R extends Result>(
  transforms: Transform[]
): OperatorFunction<T, R> {
  return source =>
    source.pipe(
      concatMap(data => {
        return of(data).pipe(
          findTransform(transforms, data).handler() as OperatorFunction<T, R>
        );
      })
    );
}

interface FoundTransform {
  validator: (value: unknown) => boolean;
  handler: (...args: unknown[]) => unknown;
}

export const findTransform = <T extends Value>(
  transforms: Transform[],
  value: T
): FoundTransform => {
  const found = transforms.find(({ validator }) => validator(value));
  if (!found) {
    return { validator: () => true, handler: (val: Value) => val }; // Fallback
  }
  return found;
};
