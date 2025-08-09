import { createAsyncReplacer, createSyncReplacer } from './serializer/replacer';
import type {
  Transform,
  AsyncTransform,
  Value,
  Result
} from './serializer/replacer';
import { map } from 'rxjs';
import type { Observable, OperatorFunction } from 'rxjs';
import { createAsyncReviver, createSyncReviver } from './serializer/reviver';
import { findTransform, traverse } from './serializer';

export function serialize<T extends Value = Value>(
  asyncTransforms: AsyncTransform[] = [],
  syncTransforms: Transform[] = []
): OperatorFunction<Result, string> {
  return (source: Observable<T>) =>
    source.pipe(
      traverse(createAsyncReplacer(asyncTransforms)),
      stringify(syncTransforms)
    );
}

export function deserialize<T extends Result>(
  asyncTransforms: AsyncTransform[] = [],
  syncTransforms: Transform[] = []
): OperatorFunction<string, T> {
  return (source: Observable<string>) =>
    source.pipe(
      parse(syncTransforms),
      traverse(createAsyncReviver(asyncTransforms))
    );
}

export function stringify<T extends Value>(
  syncTransforms: Transform[]
): OperatorFunction<T, string> {
  return source =>
    source.pipe(toJSONString(createSyncReplacer(syncTransforms)));
}

export function parse<T extends Result>(
  syncTransforms: Transform[]
): OperatorFunction<string, T> {
  return source =>
    source.pipe(fromJSONString(createSyncReviver(syncTransforms)));
}
function toJSONString<T extends Result>(
  replacer: Transform[]
): OperatorFunction<T, string> {
  return source =>
    source.pipe(
      map(data =>
        JSON.stringify(data, (_k, v) => findTransform(replacer, v).handler(v))
      )
    );
}

function fromJSONString<T extends Value>(
  reviver: Transform[]
): OperatorFunction<string, T> {
  return source =>
    source.pipe(
      map(data =>
        JSON.parse(data, (_k, v) => findTransform(reviver, v).handler(v))
      )
    );
}
