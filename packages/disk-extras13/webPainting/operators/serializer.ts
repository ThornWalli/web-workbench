/* eslint-disable @typescript-eslint/no-explicit-any */
import { type OperatorFunction, Observable } from 'rxjs';
import { concatAll, concatMap, from, map, mergeMap, of, toArray } from 'rxjs';

import type { Transform, AsyncTransform } from './serializer/replacer';
import { createAsyncReplacer } from './serializer/replacer';
import { createAsyncReviver } from './serializer/reviver';

// Define types for transform instructions
type TransformInstructionHandler<T> = (
  transforms: Transform[],
  source?: Observable<T>
) => any; // Using any for now due to complex generic inference

interface TraverseInstructions {
  [key: string | symbol | number]: TransformInstructionHandler<
    OperatorFunction<any, any>
  >;
}

const traverseInstructions: TraverseInstructions = {
  [Object.prototype.constructor.name]:
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    (transforms: Transform[]) => (source: Observable<{}>) =>
      source.pipe(
        map(Object.entries),

        traverse<[string, any][], [string, any][]>(transforms),
        map(Object.fromEntries)
      ),
  [Array.prototype.constructor.name]:
    (transforms: Transform[]) => (source: Observable<Transform[]>) =>
      source.pipe(concatAll(), traverse(transforms), toArray()),
  [Promise.prototype.constructor.name]:
    (transforms: Transform[]) => (source: Observable<Promise<any>>) =>
      source.pipe(
        concatMap(value => from(value)),
        traverse(transforms)
      ),
  [Observable.prototype.constructor.name]:
    (transforms: Transform[]) => (source: Observable<Observable<any>>) =>
      source.pipe(
        concatMap(value => value as Observable<any>),
        traverse(transforms)
      ),

  [undefined as any]: () => (source: any) => source
};

export function serialize<T>(asyncTransforms: AsyncTransform[] = []) {
  return (source: Observable<T>) =>
    source.pipe(traverse<T, T>(createAsyncReplacer(asyncTransforms)));
}

// If generics are not the same, a different type may be required in each case.
export function deserialize<T>(asyncTransforms: AsyncTransform[] = []) {
  return (source: Observable<T>) =>
    source.pipe(traverse<T, T>(createAsyncReviver(asyncTransforms)));
}

export function traverse<T, R>(
  transforms: Transform[]
): OperatorFunction<T, R> {
  return (source: Observable<T>) =>
    source.pipe(
      mergeMap(data => {
        const key = getInstructionKey(data);
        const handler = key && traverseInstructions[key];
        if (!handler) {
          // Fallback for types not explicitly handled (e.g., primitives)
          return of(data);
        }
        return of(data).pipe(handler(transforms));
      }),
      transform(transforms)
    );
}

function getInstructionKey(data: unknown) {
  if (data === null || data === undefined) {
    return undefined; // Handle null/undefined explicitly
  }
  const constructor = data.constructor;
  if (constructor) {
    // Check if the constructor's name exists as a key in traverseInstructions
    // Using constructor.name for object, array, promise, observable
    const key = constructor.name;
    if (Object.prototype.hasOwnProperty.call(traverseInstructions, key)) {
      return key;
    }
  }
  return undefined; // Default for primitives or unhandled constructors
}

function transform<T, R = unknown>(
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

export const findTransform = <T>(
  transforms: Transform[],
  value: T
): FoundTransform => {
  const found = transforms.find(({ validator }) => validator(value));
  if (!found) {
    // This should ideally not happen if the last transform is always a 'true' validator
    // as in replacer.js and reviver.js
    return { validator: () => true, handler: (val: unknown) => val }; // Fallback
  }
  return found;
};
