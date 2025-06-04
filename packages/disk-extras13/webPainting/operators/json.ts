/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createAsyncReplacer,
  createSyncReplacer,
  type Transform,
  type AsyncTransform
} from './serializer/replacer';
import { map, type Observable, type OperatorFunction } from 'rxjs';
import { createAsyncReviver, createSyncReviver } from './serializer/reviver';
import { findTransform, traverse } from './serializer';

export function serialize<T = any>(
  asyncTransforms: AsyncTransform[] = [],
  syncTransforms: Transform[] = []
): OperatorFunction<any, string> {
  return (source: Observable<T>) =>
    source.pipe(
      traverse(createAsyncReplacer(asyncTransforms)),
      stringify(syncTransforms)
    );
}

export function deserialize<T>(
  asyncTransforms: AsyncTransform[] = [],
  syncTransforms: Transform[] = []
): OperatorFunction<string, T> {
  return (source: Observable<string>) =>
    source.pipe(
      parse(syncTransforms),
      traverse(createAsyncReviver(asyncTransforms))
    );
}

export function stringify<T>(
  syncTransforms: Transform[]
): OperatorFunction<T, string> {
  return source =>
    source.pipe(toJSONString(createSyncReplacer(syncTransforms)));
}

export function parse<T>(
  syncTransforms: Transform[]
): OperatorFunction<string, T> {
  return source =>
    source.pipe(fromJSONString(createSyncReviver(syncTransforms)));
}
function toJSONString<T>(replacer: Transform[]): OperatorFunction<T, string> {
  return source =>
    source.pipe(
      map(data =>
        JSON.stringify(data, (_k, v) => findTransform(replacer, v).handler(v))
      )
    );
}

const fromJSONString =
  (reviver: Transform[]): OperatorFunction<string, any> =>
  source =>
    source.pipe(
      map(data =>
        JSON.parse(data, (_k, v) => findTransform(reviver, v).handler(v))
      )
    );
